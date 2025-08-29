package com.example.chat.controller;

import com.example.chat.dto.DmMessageDto;
import com.example.chat.dto.DmThreadDto;
import com.example.chat.dto.DmThreadWithLastMessage;
import com.example.chat.dto.UserSearchResult;
import com.example.chat.service.DmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/dm")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DmRestController {

    private final DmService dmService;

    /**
     * DM 스레드 생성/조회
     */
    @PostMapping("/threads")
    public ResponseEntity<DmThreadDto> createOrGetThread(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        try {
            Long myUserId = getUserId(principal);

            // 닉네임 또는 userId로 스레드 생성
            Long otherUserId = null;
            if (request.containsKey("userId")) {
                otherUserId = Long.parseLong(request.get("userId").toString());
            } else if (request.containsKey("nickname")) {
                String nickname = request.get("nickname").toString();
                otherUserId = dmService.findUserByNickname(nickname)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + nickname));
            }

            if (otherUserId == null) {
                return ResponseEntity.badRequest().build();
            }

            DmThreadDto thread = dmService.findOrCreateThread(myUserId, otherUserId);
            return ResponseEntity.ok(thread);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid thread creation request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to create/get thread: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 사용자의 DM 스레드 목록
     */
    @GetMapping("/threads")
    public ResponseEntity<List<DmThreadWithLastMessage>> getUserThreads(Principal principal) {
        try {
            Long userId = getUserId(principal);
            List<DmThreadWithLastMessage> threads = dmService.getUserThreads(userId);
            return ResponseEntity.ok(threads);
        } catch (Exception e) {
            log.error("Failed to get user threads: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 최근 메시지 조회
     */
    @GetMapping("/threads/{threadId}/messages")
    public ResponseEntity<List<DmMessageDto>> getRecentMessages(
            @PathVariable Long threadId,
            @RequestParam(defaultValue = "50") int limit,
            Principal principal) {
        try {
            Long userId = getUserId(principal);

            // 권한 확인
            if (!dmService.hasThreadAccess(threadId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<DmMessageDto> messages = dmService.getRecentMessages(threadId, limit);
            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            log.error("Failed to get messages for thread {}: ", threadId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 이전 메시지 조회 (페이징)
     */
    @GetMapping("/threads/{threadId}/messages/before/{messageId}")
    public ResponseEntity<List<DmMessageDto>> getMessagesBefore(
            @PathVariable Long threadId,
            @PathVariable Long messageId,
            @RequestParam(defaultValue = "50") int limit,
            Principal principal) {
        try {
            Long userId = getUserId(principal);

            if (!dmService.hasThreadAccess(threadId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<DmMessageDto> messages = dmService.getMessagesBefore(threadId, messageId, limit);
            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            log.error("Failed to get messages before {}: ", messageId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 사용자 검색
     */
    @GetMapping("/users/search")
    public ResponseEntity<List<UserSearchResult>> searchUsers(
            @RequestParam String query,
            Principal principal) {
        try {
            if (query.length() < 2) {
                return ResponseEntity.ok(List.of());
            }

            List<UserSearchResult> results = dmService.searchUsers(query);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            log.error("Failed to search users: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 연결 상태 확인 (Health Check)
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck(Principal principal) {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", System.currentTimeMillis(),
                "user", principal != null ? principal.getName() : "anonymous"
        ));
    }

    /**
     * Principal에서 userId 추출
     */
    private Long getUserId(Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("User not authenticated");
        }

        try {
            // JWT에서 userId 추출 (실제 구현은 인증 방식에 따라 다름)
            return Long.parseLong(principal.getName());
        } catch (NumberFormatException e) {
            // JWT 토큰 파싱 로직
            throw new IllegalArgumentException("Invalid user ID format");
        }
    }
}
