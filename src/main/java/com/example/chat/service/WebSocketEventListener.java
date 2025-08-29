package com.example.chat.service;

import com.example.chat.service.WebSocketSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final WebSocketSessionManager sessionManager;

    /**
     * WebSocket 연결 이벤트
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        Principal user = headerAccessor.getUser();

        if (user != null) {
            sessionManager.registerSession(sessionId, user.getName());
            log.info("WebSocket connected: sessionId={}, user={}", sessionId, user.getName());
        }
    }

    /**
     * WebSocket 연결 해제 이벤트
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        sessionManager.removeSession(sessionId);
        log.info("WebSocket disconnected: sessionId={}, status={}",
                sessionId, event.getCloseStatus());

        // 비정상 종료 감지
        if (event.getCloseStatus().getCode() == 1006) {
            log.warn("Abnormal WebSocket closure detected for session: {}", sessionId);
            // 재연결 대기 또는 복구 로직
        }
    }

    /**
     * STOMP 구독 이벤트
     */
    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();
        Principal user = headerAccessor.getUser();

        if (destination != null && user != null) {
            // /topic/thread.{threadId} 패턴 파싱
            if (destination.startsWith("/topic/thread.")) {
                try {
                    String threadIdStr = destination.substring("/topic/thread.".length());
                    // .typing 등 서브 채널 제거
                    if (threadIdStr.contains(".")) {
                        threadIdStr = threadIdStr.substring(0, threadIdStr.indexOf("."));
                    }
                    Long threadId = Long.parseLong(threadIdStr);
                    sessionManager.addSubscription(user.getName(), threadId);

                    log.debug("User {} subscribed to thread {}", user.getName(), threadId);
                } catch (NumberFormatException e) {
                    log.warn("Invalid thread ID in destination: {}", destination);
                }
            }
        }
    }

    /**
     * STOMP 구독 해제 이벤트
     */
    @EventListener
    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();
        Principal user = headerAccessor.getUser();

        log.debug("Unsubscribe event: destination={}, user={}",
                destination, user != null ? user.getName() : "unknown");
    }
}