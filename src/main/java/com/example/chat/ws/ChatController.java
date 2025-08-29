package com.example.chat.ws;

import com.example.chat.domain.DmMessage;
import com.example.chat.dto.Payloads.*;
import com.example.chat.service.DmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final DmService dmService;
    private final SimpMessagingTemplate template;

    @MessageMapping("/chat.send.{threadId}")
    public void onSend(@DestinationVariable Long threadId,
                       @Payload WsChatSend payload,
                       Principal principal) {
        Long senderId = Long.valueOf(principal.getName());
        try {
            DmMessage saved = dmService.saveMessage(senderId, threadId, payload.getBody(), payload.getFileUser());

            WsChatEvent event = WsChatEvent.builder()
                    .type("CHAT")
                    .threadId(threadId)
                    .messageId(saved.getId())
                    .senderId(senderId)
                    .body(saved.getBody())
                    .fileUrl(saved.getFileUrl())
                    .clientMsgId(payload.getClientMsgId())
                    .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                    .build();

            // 같은 스레드 구독자에게 브로드캐스트
            template.convertAndSend("/topic/thread." + threadId, event);

            // 송신자 ACK
            WsChatEvent ack = WsChatEvent.builder()
                    .type("ACK")
                    .threadId(threadId)
                    .messageId(saved.getId())
                    .clientMsgId(payload.getClientMsgId())
                    .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                    .build();
            template.convertAndSendToUser(principal.getName(), "/queue/ack", ack);

        } catch (Exception e) {
            log.error("WS SEND ERROR", e);
            WsChatEvent err = WsChatEvent.builder()
                    .type("ERROR")
                    .threadId(threadId)
                    .errorCode("SEND_FAILED")
                    .errorMessage(e.getMessage())
                    .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                    .build();
            template.convertAndSendToUser(principal.getName(), "/queue/errors", err);
        }
    }

    @MessageExceptionHandler
    public void onException(Throwable t, Principal principal) {
        log.error("WS exception", t);
        WsChatEvent err = WsChatEvent.builder()
                .type("ERROR")
                .errorCode("DECODE_OR_INTERNAL")
                .errorMessage(t.getMessage())
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();
        if (principal != null) {
            template.convertAndSendToUser(principal.getName(), "/queue/errors", err);
        }
    }
}

