package com.example.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * WebSocket 재연결 관리 정보
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReconnectInfo {
    private String sessionId;             // 세션 ID
    private AtomicInteger retryCount;     // 재연결 시도 횟수
    private LocalDateTime lastAttempt;    // 마지막 재연결 시도 시간
    private boolean success;              // 최종 성공 여부
}
