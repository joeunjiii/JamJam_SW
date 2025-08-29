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

    @Transactional(readOnly = true)
    public boolean hasThreadAccess(Long threadId, Long userId) {
        return threadRepository.findById(threadId)
                .map(t -> t.getUser1Id().equals(userId) || t.getUser2Id().equals(userId))
                .orElse(false);
    }

    @Transactional
    @Retryable(value = {DataIntegrityViolationException.class},
            maxAttempts = 3, backoff = @Backoff(delay = 100))
    public DmThreadDto findOrCreateThread(Long userId1, Long userId2) {
        Long a = Math.min(userId1, userId2);
        Long b = Math.max(userId1, userId2);

        Optional<DmThread> existing = threadRepository.findByUser1IdAndUser2Id(a, b);
        if (existing.isPresent()) return toDto(existing.get());

        DmThread t = DmThread.builder()
                .user1Id(a).user2Id(b)
                .createdAt(LocalDateTime.now())
                .build();
        try {
            DmThread saved = threadRepository.save(t);
            log.info("[DM] create thread {}: {}-{}", saved.getThreadId(), a, b);
            return toDto(saved);
        } catch (DataIntegrityViolationException e) {
            log.warn("[DM] concurrent creation, find existing");
            return threadRepository.findByUser1IdAndUser2Id(a, b)
                    .map(this::toDto)
                    .orElseThrow(() -> new RuntimeException("Failed to create/find thread"));
        }
    }

    @Transactional
    @Retryable(value = {OptimisticLockingFailureException.class},
            maxAttempts = 3, backoff = @Backoff(delay = 50))
    public DmMessageDto saveMessage(Long threadId, Long senderId, DmMessage in) {
        validateMessage(in);
        String body = in.getBody() != null
                ? new String(in.getBody().getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8)
                : null;

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

    @Transactional(readOnly = true)
    public List<DmMessageDto> getMessagesBefore(Long threadId, Long beforeMessageId, int limit) {
        DmMessage pivot = messageRepository.findById(beforeMessageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found: " + beforeMessageId));
        PageRequest page = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return messageRepository.findByThreadIdAndCreatedAtBefore(threadId, pivot.getCreatedAt(), page)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DmMessageDto> getRecentMessages(Long threadId, int limit) {
        PageRequest page = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return messageRepository.findByThreadIdOrderByCreatedAtDesc(threadId, page)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DmThreadWithLastMessage> getUserThreads(Long userId) {
        List<DmThread> threads = threadRepository.findByUserId(userId);
        return threads.stream().map(t -> {
                    Optional<DmMessage> last = messageRepository.findFirstByThreadIdOrderByCreatedAtDesc(t.getThreadId());
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
                }).sorted((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()))
                .collect(Collectors.toList());
    }

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

    private void validateMessage(DmMessage m) {
        if (m.getBody() == null && m.getFileUrl() == null)
            throw new IllegalArgumentException("Message must have body or file");
        if (m.getBody() != null && m.getBody().length() > 10000)
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
