package com.example.chat.handler;

import com.example.chat.dto.ReconnectInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
public class WebSocketReconnectHandler extends AbstractWebSocketHandler {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);
    private final ConcurrentHashMap<String, ReconnectInfo> reconnectMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket connection established: {}", session.getId());

        // 재연결 정보 초기화
        reconnectMap.remove(session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("WebSocket transport error for session {}: ", session.getId(), exception);

        // 재연결 시도
        scheduleReconnect(session);
    }

    private void scheduleReconnect(WebSocketSession session) {
        String sessionId = session.getId();

        ReconnectInfo info = reconnectMap.computeIfAbsent(sessionId, id ->
                new ReconnectInfo(id, new AtomicInteger(0), LocalDateTime.now(), false));

        scheduler.schedule(() -> {
            int attempt = info.getRetryCount().incrementAndGet();
            info.setLastAttempt(LocalDateTime.now());
            log.info("Retrying WebSocket reconnect for session {} (attempt #{})", sessionId, attempt);

            // TODO: 실제 reconnect 로직 구현 필요
        }, 3, TimeUnit.SECONDS);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket connection closed: sessionId={}, status={}",
                session.getId(), status);

        // 비정상 종료인 경우 재연결
        if (status.getCode() == 1006 || status.getCode() >= 1011) {
        }
    }
}