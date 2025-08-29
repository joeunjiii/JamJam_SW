package com.example.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final WebSocketSessionManager sessionManager;

    @EventListener
    public void onConnect(SessionConnectedEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = acc.getSessionId();
        Principal user = acc.getUser();
        if (user != null) {
            sessionManager.registerSession(sessionId, user.getName());
            log.info("[WS] CONNECTED session={} user={}", sessionId, user.getName());
        } else {
            log.warn("[WS] CONNECTED without Principal (dev)");
        }
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = acc.getSessionId();
        sessionManager.removeSession(sessionId);
        log.info("[WS] DISCONNECTED session={} status={}", sessionId, event.getCloseStatus());
    }

    @EventListener
    public void onSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        String dest = acc.getDestination();
        String sessionId = acc.getSessionId();
        Principal user = acc.getUser();

        if (dest != null && sessionId != null && user != null && dest.startsWith("/topic/thread.")) {
            try {
                String threadStr = dest.substring("/topic/thread.".length());
                if (threadStr.contains(".")) threadStr = threadStr.substring(0, threadStr.indexOf('.'));
                Long threadId = Long.parseLong(threadStr);
                sessionManager.addSubscription(sessionId, user.getName(), threadId);
                log.debug("[WS] SUBSCRIBE user={} session={} thread={}", user.getName(), sessionId, threadId);
            } catch (NumberFormatException e) {
                log.warn("[WS] invalid thread dest: {}", dest);
            }
        }
    }

    @EventListener
    public void onUnsubscribe(SessionUnsubscribeEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        String dest = acc.getDestination();
        String sessionId = acc.getSessionId();
        Principal user = acc.getUser();

        if (dest != null && sessionId != null && user != null && dest.startsWith("/topic/thread.")) {
            try {
                String threadStr = dest.substring("/topic/thread.".length());
                if (threadStr.contains(".")) threadStr = threadStr.substring(0, threadStr.indexOf('.'));
                Long threadId = Long.parseLong(threadStr);
                sessionManager.removeSubscription(sessionId, user.getName(), threadId);
                log.debug("[WS] UNSUBSCRIBE user={} session={} thread={}", user.getName(), sessionId, threadId);
            } catch (NumberFormatException e) {
                log.warn("[WS] invalid thread dest: {}", dest);
            }
        } else {
            log.debug("[WS] UNSUBSCRIBE dest={} user={}", dest, user != null ? user.getName() : "null");
        }
    }
}
