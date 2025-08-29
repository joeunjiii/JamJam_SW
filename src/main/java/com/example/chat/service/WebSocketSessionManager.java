package com.example.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketSessionManager {


    // 사용자별 활성 세션
    private final Map<String, SessionInfo> activeSessions = new ConcurrentHashMap<>();

    // 스레드별 구독자
    private final Map<Long, Set<String>> threadSubscribers = new ConcurrentHashMap<>();

    // 세션별 구독 스레드
    private final Map<String, Set<Long>> userSubscriptions = new ConcurrentHashMap<>();

    /**
     * 세션 등록
     */
    public void registerSession(String sessionId, String userId) {
        SessionInfo info = new SessionInfo(sessionId, userId, LocalDateTime.now());
        activeSessions.put(sessionId, info);
        userSubscriptions.putIfAbsent(userId, ConcurrentHashMap.newKeySet());

        log.info("Session registered: sessionId={}, userId={}", sessionId, userId);
    }

    /**
     * 세션 제거
     */
    public void removeSession(String sessionId) {
        SessionInfo info = activeSessions.remove(sessionId);
        if (info != null) {
            // 구독 정리
            Set<Long> threads = userSubscriptions.remove(info.getUserId());
            if (threads != null) {
                for (Long threadId : threads) {
                    Set<String> subscribers = threadSubscribers.get(threadId);
                    if (subscribers != null) {
                        subscribers.remove(info.getUserId());
                        if (subscribers.isEmpty()) {
                            threadSubscribers.remove(threadId);
                        }
                    }
                }
            }

            log.info("Session removed: sessionId={}, userId={}", sessionId, info.getUserId());
        }
    }

    /**
     * 스레드 구독 추가
     */
    public void addSubscription(String userId, Long threadId) {
        userSubscriptions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(threadId);
        threadSubscribers.computeIfAbsent(threadId, k -> new CopyOnWriteArraySet<>()).add(userId);

        log.debug("Subscription added: userId={}, threadId={}", userId, threadId);
    }

    /**
     * 스레드 구독 제거
     */
    public void removeSubscription(String userId, Long threadId) {
        Set<Long> threads = userSubscriptions.get(userId);
        if (threads != null) {
            threads.remove(threadId);
        }

        Set<String> subscribers = threadSubscribers.get(threadId);
        if (subscribers != null) {
            subscribers.remove(userId);
            if (subscribers.isEmpty()) {
                threadSubscribers.remove(threadId);
            }
        }

        log.debug("Subscription removed: userId={}, threadId={}", userId, threadId);
    }

    /**
     * 스레드 구독자 조회
     */
    public Set<String> getThreadSubscribers(Long threadId) {
        return new HashSet<>(threadSubscribers.getOrDefault(threadId, Collections.emptySet()));
    }

    /**
     * 사용자 온라인 상태 확인
     */
    public boolean isUserOnline(String userId) {
        return activeSessions.values().stream()
                .anyMatch(session -> session.getUserId().equals(userId));
    }

    /**
     * 활성 세션 수
     */
    public int getActiveSessionCount() {
        return activeSessions.size();
    }

    /**
     * 세션 정보
     */
    private static class SessionInfo {
        private final String sessionId;
        private final String userId;
        private final LocalDateTime connectedAt;
        private LocalDateTime lastActivityAt;

        public SessionInfo(String sessionId, String userId, LocalDateTime connectedAt) {
            this.sessionId = sessionId;
            this.userId = userId;
            this.connectedAt = connectedAt;
            this.lastActivityAt = connectedAt;
        }

        public String getSessionId() { return sessionId; }
        public String getUserId() { return userId; }
        public LocalDateTime getConnectedAt() { return connectedAt; }
        public LocalDateTime getLastActivityAt() { return lastActivityAt; }

        public void updateActivity() {
            this.lastActivityAt = LocalDateTime.now();
        }
    }
}
