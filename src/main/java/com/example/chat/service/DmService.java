package com.example.chat.service;

import com.example.auth.user.Member;
import com.example.auth.user.MemberRepository;
import com.example.chat.domain.DmMessage;
import com.example.chat.domain.DmThread;
import com.example.chat.dto.DmMessageDto;
import com.example.chat.dto.DmThreadDto;
import com.example.chat.dto.DmThreadWithLastMessage;
import com.example.chat.dto.UserSearchResult;
import com.example.chat.Repository.DmMessageRepository;
import com.example.chat.Repository.DmThreadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DmService {

    private final DmThreadRepository threadRepository;
    private final DmMessageRepository messageRepository;
    private final MemberRepository memberRepository;

    // --- 권한 확인 ---

    @Transactional(readOnly = true)
    public boolean hasThreadAccess(Long threadId, Long userId) {
        return threadRepository.findById(threadId)
                .map(t -> t.getUser1Id().equals(userId) || t.getUser2Id().equals(userId))
                .orElse(false);
    }

    // --- 스레드 생성/조회 ---

    @Transactional
    @Retryable(
            value = { DataIntegrityViolationException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 100)
    )
    public DmThreadDto findOrCreateThread(Long userId1, Long userId2) {
        Long a = Math.min(userId1, userId2);
        Long b = Math.max(userId1, userId2);

        // 1) 기존 스레드 조회
        Optional<DmThread> existing = threadRepository.findByUser1IdAndUser2Id(a, b);
        if (existing.isPresent()) return toDto(existing.get());

        // 2) 신규 생성 (DB에 (user1_id, user2_id) 유니크 인덱스 필수)
        DmThread t = DmThread.builder()
                .user1Id(a).user2Id(b)
                .createdAt(LocalDateTime.now())
                .build();

        try {
            DmThread saved = threadRepository.save(t);
            log.info("[DM] create thread {}: {}-{}", saved.getThreadId(), a, b);
            return toDto(saved);
        } catch (DataIntegrityViolationException e) {
            // 동시 생성 경쟁: 유니크 제약 위반 시 재조회
            log.warn("[DM] concurrent creation, fallback to find existing");
            return threadRepository.findByUser1IdAndUser2Id(a, b)
                    .map(this::toDto)
                    .orElseThrow(() -> new RuntimeException("Failed to create/find thread"));
        }
    }

    // --- 메시지 저장 ---

    @Transactional
    @Retryable(
            value = { OptimisticLockingFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 50)
    )
    public DmMessageDto saveMessage(Long threadId, Long senderId, DmMessage in) {
        validateMessage(in);

        // (선택) UTF-8 정규화 – 클라이언트 인코딩 이슈가 있을 때만 의미 있음
        String body = in.getBody() != null
                ? new String(in.getBody().getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8)
                : null;

        // 스레드 접근/존재 검증을 서비스에서도 한 번 더(컨트롤러에서 이미 했더라도 방어적)
        if (!threadRepository.existsById(threadId)) {
            throw new IllegalArgumentException("Thread not found: " + threadId);
        }

        DmMessage entity = DmMessage.builder()
                .threadId(threadId)
                .senderId(senderId)
                .body(body)
                .fileUrl(in.getFileUrl())
                .createdAt(LocalDateTime.now())
                .build();

        DmMessage saved = messageRepository.save(entity);
        log.info("[DM] message saved id={} thread={} sender={}", saved.getMessageId(), threadId, senderId);
        return toDto(saved);
    }

    // --- 메시지 조회 ---

    @Transactional(readOnly = true)
    public List<DmMessageDto> getMessagesBefore(Long threadId, Long beforeMessageId, int limit) {
        DmMessage pivot = messageRepository.findById(beforeMessageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found: " + beforeMessageId));

        // 안전장치: pivot이 다른 스레드에 속하면 400
        if (!pivot.getThreadId().equals(threadId)) {
            throw new IllegalArgumentException("Pivot message does not belong to thread " + threadId);
        }

        PageRequest page = PageRequest.of(0, Math.min(limit, 200),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return messageRepository.findByThreadIdAndCreatedAtBefore(threadId, pivot.getCreatedAt(), page)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DmMessageDto> getRecentMessages(Long threadId, int limit) {
        PageRequest page = PageRequest.of(0, Math.min(limit, 200),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return messageRepository.findByThreadIdOrderByCreatedAtDesc(threadId, page)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // --- 사용자의 스레드 목록 ---

    @Transactional(readOnly = true)
    public List<DmThreadWithLastMessage> getUserThreads(Long userId) {
        List<DmThread> threads = threadRepository.findByUserId(userId);

        return threads.stream().map(t -> {
                    Optional<DmMessage> last = messageRepository
                            .findFirstByThreadIdOrderByCreatedAtDesc(t.getThreadId());

                    Long otherId = t.getUser1Id().equals(userId) ? t.getUser2Id() : t.getUser1Id();
                    Member other = memberRepository.findById(otherId).orElse(null);

                    return DmThreadWithLastMessage.builder()
                            .threadId(t.getThreadId())
                            .otherUserId(otherId)
                            .otherUserNickname(other != null ? other.getNickname() : "Unknown")
                            .otherUserProfileImage(other != null ? other.getProfileImageUrl() : null)
                            .lastMessage(last.map(DmMessage::getBody).orElse(null))
                            .lastMessageTime(last.map(DmMessage::getCreatedAt).orElse(t.getCreatedAt()))
                            .unreadCount(0) // TODO: 읽음 상태 구현 시 교체
                            .build();
                })
                .sorted((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()))
                .collect(Collectors.toList());
    }

    // --- 보조 조회/검증 ---

    @Transactional(readOnly = true)
    public Optional<Long> findUserByNickname(String nickname) {
        return memberRepository.findByNickname(nickname).map(Member::getId);
    }

    @Transactional(readOnly = true)
    public List<UserSearchResult> searchUsers(String q) {
        return memberRepository.findByNicknameContainingIgnoreCase(q)
                .stream().map(m -> UserSearchResult.builder()
                        .userId(m.getId())
                        .nickname(m.getNickname())
                        .profileImageUrl(m.getProfileImageUrl())
                        .isOnline(false)
                        .build())
                .collect(Collectors.toList());
    }

    // --- 내부 변환/검증 ---

    private void validateMessage(DmMessage m) {
        if (m.getBody() == null && m.getFileUrl() == null)
            throw new IllegalArgumentException("Message must have body or file");
        if (m.getBody() != null && m.getBody().length() > 10_000)
            throw new IllegalArgumentException("Message body too long");
        if (m.getFileUrl() != null && m.getFileUrl().length() > 500)
            throw new IllegalArgumentException("File URL too long");
    }

    private DmThreadDto toDto(DmThread t) {
        return DmThreadDto.builder()
                .threadId(t.getThreadId())
                .user1Id(t.getUser1Id())
                .user2Id(t.getUser2Id())
                .createdAt(t.getCreatedAt())
                .build();
    }

    private DmMessageDto toDto(DmMessage m) {
        return DmMessageDto.builder()
                .messageId(m.getMessageId())
                .threadId(m.getThreadId())
                .senderId(m.getSenderId())
                .body(m.getBody())
                .fileUrl(m.getFileUrl())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
