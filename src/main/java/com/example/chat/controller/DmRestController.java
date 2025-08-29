package com.example.chat.controller;

import com.example.chat.domain.DmMessage;
import com.example.chat.dto.DmMessageDto;
import com.example.chat.dto.DmThreadDto;
import com.example.chat.dto.DmThreadWithLastMessage;
import com.example.chat.dto.WebSocketMessage;
import com.example.chat.service.DmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/dm")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DmRestController {

    private final DmService dmService;
    private final SimpMessagingTemplate messagingTemplate;

    // 스레드 생성/조회
    @PostMapping("/thread")
    public ResponseEntity<DmThreadDto> createThread(Principal principal,
                                                    @RequestParam("otherUserId") Long otherUserId) {
        Long me = currentUserId(principal);
        DmThreadDto dto = dmService.findOrCreateThread(me, otherUserId);
        return ResponseEntity.ok(dto);
    }

    // 내 스레드 목록
    @GetMapping("/threads")
    public ResponseEntity<List<DmThreadWithLastMessage>> threads(Principal principal) {
        Long me = currentUserId(principal);
        return ResponseEntity.ok(dmService.getUserThreads(me));
    }

    // 최근 메시지 조회
    @GetMapping("/{threadId}/recent")
    public ResponseEntity<List<DmMessageDto>> recent(@PathVariable Long threadId,
                                                     @RequestParam(defaultValue = "50") int limit,
                                                     Principal principal) {
        ensureAccess(threadId, principal);
        return ResponseEntity.ok(dmService.getRecentMessages(threadId, Math.min(limit, 200)));
    }

    // 특정 메시지 이전 조회 (페이지네이션)
    @GetMapping("/{threadId}/before")
    public ResponseEntity<List<DmMessageDto>> before(@PathVariable Long threadId,
                                                     @RequestParam("beforeMessageId") Long beforeId,
                                                     @RequestParam(defaultValue = "50") int limit,
                                                     Principal principal) {
        ensureAccess(threadId, principal);
        return ResponseEntity.ok(dmService.getMessagesBefore(threadId, beforeId, Math.min(limit, 200)));
    }

    // 메시지 저장 + STOMP 브로드캐스트 (/topic/thread.{id})
    @PostMapping("/{threadId}/messages")
    public ResponseEntity<DmMessageDto> send(@PathVariable Long threadId,
                                             @RequestBody DmMessage payload,
                                             Principal principal) {
        Long me = currentUserId(principal);
        ensureAccess(threadId, principal);

        DmMessageDto saved = dmService.saveMessage(threadId, me, payload);

        WebSocketMessage ws = WebSocketMessage.builder()
                .type("CHAT")
                .threadId(saved.getThreadId())
                .messageId(saved.getMessageId())
                .senderId(saved.getSenderId())
                .body(saved.getBody())
                .fileUrl(saved.getFileUrl())
                .createdAt(saved.getCreatedAt())
                .build();

        messagingTemplate.convertAndSend("/topic/thread." + threadId, ws);
        return ResponseEntity.ok(saved);
    }

    // 유틸: Principal에서 Long userId 추출 (dev: Principal.getName()은 X-Auth-UserId)
    private Long currentUserId(Principal p) {
        if (p == null || p.getName() == null) throw new RuntimeException("Unauthenticated");
        try { return Long.valueOf(p.getName()); }
        catch (NumberFormatException e) { throw new RuntimeException("Invalid Principal name"); }
    }

    private void ensureAccess(Long threadId, Principal p) {
        Long me = currentUserId(p);
        if (!dmService.hasThreadAccess(threadId, me))
            throw new RuntimeException("Forbidden");
    }
}
