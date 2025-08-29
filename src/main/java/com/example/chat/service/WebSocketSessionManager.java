package com.example.chat.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 세션/구독을 "세션 단위"로 관리하여 같은 유저의
 * 여러 기기(세션) 접속에도 안전하게 동작하도록 한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketSessionManager {

    // 세션ID -> 세션정보
    private final Map<String, SessionInfo> sessions = new ConcurrentHashMap<>();

    // 유저ID -> 세션ID 집합
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    // 세션ID -> 구독중인 threadId 집합
    private final Map<String, Set<Long>> sessionSubscriptions = new ConcurrentHashMap<>();

    // threadId -> 구독중인 "유저ID" 집합 (표시용)
    private final Map<Long, Set<String>> threadSubscribers = new ConcurrentHashMap<>();

    public void registerSession(String sessionId, String userId) {
        sessions.put(sessionId, new SessionInfo(sessionId, userId, LocalDateTime.now()));
        userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        sessionSubscriptions.putIfAbsent(sessionId, ConcurrentHashMap.newKeySet());
        log.info("[WS] registerSession: session={}, user={}", sessionId, userId);
    }

    public void removeSession(String sessionId) {
        SessionInfo info = sessions.remove(sessionId);
        if (info == null) return;

        // 해당 세션의 구독 정리
        Set<Long> threads = sessionSubscriptions.remove(sessionId);
        if (threads != null) {
            for (Long t : threads) {
                // threadSubscribers에는 "유저 단위"로 표시하므로,
                // 해당 유저의 다른 세션이 같은 thread를 여전히 구독 중인지 확인
                boolean stillSubscribedByUser = userHasSubscriptionForThread(info.getUserId(), t, sessionId);
                if (!stillSubscribedByUser) {
                    Set<String> subs = threadSubscribers.get(t);
                    if (subs != null) {
                        subs.remove(info.getUserId());
                        if (subs.isEmpty()) threadSubscribers.remove(t);
                    }
                }
            }
        }

        // 유저-세션 매핑 정리
        Set<String> sessionsOfUser = userSessions.getOrDefault(info.getUserId(), Collections.emptySet());
        sessionsOfUser.remove(sessionId);
        if (sessionsOfUser.isEmpty()) {
            userSessions.remove(info.getUserId());
        }

        log.info("[WS] removeSession: session={}, user={}", sessionId, info.getUserId());
    }

    public void addSubscription(String sessionId, String userId, Long threadId) {
        sessionSubscriptions.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(threadId);
        // 유저 레벨 구독자 목록 (표시용)
        threadSubscribers.computeIfAbsent(threadId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        log.debug("[WS] addSubscription: session={}, user={}, thread={}", sessionId, userId, threadId);
    }

    public void removeSubscription(String sessionId, String userId, Long threadId) {
        Set<Long> set = sessionSubscriptions.get(sessionId);
        if (set != null) set.remove(threadId);

        // 같은 유저의 다른 세션이 계속 구독 중인 경우는 threadSubscribers에서 유지
        boolean still = userHasSubscriptionForThread(userId, threadId, sessionId);
        if (!still) {
            Set<String> subs = threadSubscribers.get(threadId);
            if (subs != null) {
                subs.remove(userId);
                if (subs.isEmpty()) threadSubscribers.remove(threadId);
            }
        }
        log.debug("[WS] removeSubscription: session={}, user={}, thread={}", sessionId, userId, threadId);
    }

    public boolean isUserOnline(String userId) {
        return userSessions.containsKey(userId) && !userSessions.get(userId).isEmpty();
    }

    public Set<String> getThreadSubscribers(Long threadId) {
        return new HashSet<>(threadSubscribers.getOrDefault(threadId, Collections.emptySet()));
    }

    private boolean userHasSubscriptionForThread(String userId, Long threadId, String exceptSessionId) {
        Set<String> sessionsOfUser = userSessions.getOrDefault(userId, Collections.emptySet());
        for (String sid : sessionsOfUser) {
            if (sid.equals(exceptSessionId)) continue;
            Set<Long> subs = sessionSubscriptions.getOrDefault(sid, Collections.emptySet());
            if (subs.contains(threadId)) return true;
        }
        return false;
    }

    @Getter
    private static class SessionInfo {
        private final String sessionId;
        private final String userId;
        private final LocalDateTime connectedAt;
        private LocalDateTime lastActivityAt;

        SessionInfo(String sessionId, String userId, LocalDateTime connectedAt) {
            this.sessionId = sessionId;
            this.userId = userId;
            this.connectedAt = connectedAt;
            this.lastActivityAt = connectedAt;
        }
        void touch() { this.lastActivityAt = LocalDateTime.now(); }
    }
}
