package com.example.chat.handler;

import com.example.chat.dto.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketErrorHandler extends StompSubProtocolErrorHandler {

    private final SimpMessagingTemplate messagingTemplate;

    // 에러 카운터 (세션별)
    private final ConcurrentHashMap<String, AtomicInteger> errorCounters = new ConcurrentHashMap<>();

    // 최대 에러 허용 횟수
    private static final int MAX_ERROR_COUNT = 5;

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(clientMessage);
        String sessionId = accessor.getSessionId();

        // 에러 카운트 증가
        AtomicInteger errorCount = errorCounters.computeIfAbsent(sessionId, k -> new AtomicInteger(0));
        int count = errorCount.incrementAndGet();

        log.error("WebSocket client message processing error [{}]: sessionId={}, errorCount={}",
                ex.getClass().getSimpleName(), sessionId, count, ex);

        // 에러 타입별 처리
        String errorCode = "UNKNOWN_ERROR";
        String errorMessage = "An error occurred processing your message";

        if (ex instanceof MessageDeliveryException) {
            errorCode = "MESSAGE_DELIVERY_ERROR";
            errorMessage = "Failed to deliver message";
        } else if (ex instanceof IllegalArgumentException) {
            errorCode = "INVALID_MESSAGE";
            errorMessage = ex.getMessage();
        } else if (ex.getMessage() != null && ex.getMessage().contains("encoding")) {
            errorCode = "ENCODING_ERROR";
            errorMessage = "Message encoding error. Please use UTF-8";
        }

        // 클라이언트에 에러 응답
        if (accessor.getUser() != null) {
            sendErrorToUser(accessor.getUser().getName(), errorCode, errorMessage);
        }

        // 최대 에러 횟수 초과 시 연결 종료
        if (count >= MAX_ERROR_COUNT) {
            log.warn("Max error count exceeded for session {}. Closing connection.", sessionId);
            errorCounters.remove(sessionId);

            // 연결 종료 메시지
            StompHeaderAccessor errorAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
            errorAccessor.setMessage("Too many errors. Connection will be closed.");
            errorAccessor.setSessionId(sessionId);

            return MessageBuilder.createMessage(
                    errorAccessor.getMessage().getBytes(StandardCharsets.UTF_8),
                    errorAccessor.getMessageHeaders()
            );
        }

        return super.handleClientMessageProcessingError(clientMessage, ex);
    }

    @Override
    public Message<byte[]> handleErrorMessageToClient(Message<byte[]> errorMessage) {
        log.error("Sending error message to client: {}", new String(errorMessage.getPayload()));
        return super.handleErrorMessageToClient(errorMessage);
    }

    /**
     * 세션 정리
     */
    public void clearSession(String sessionId) {
        errorCounters.remove(sessionId);
    }

    /**
     * 에러 메시지 전송
     */
    private void sendErrorToUser(String username, String errorCode, String errorMessage) {
        try {
            WebSocketMessage error = WebSocketMessage.builder()
                    .type("ERROR")
                    .errorCode(errorCode)
                    .errorMessage(errorMessage)
                    .createdAt(LocalDateTime.now())
                    .build();

            messagingTemplate.convertAndSendToUser(username, "/queue/errors", error);
        } catch (Exception e) {
            log.error("Failed to send error to user {}: ", username, e);
        }
    }
}
