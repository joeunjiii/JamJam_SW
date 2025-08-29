package com.example.chat.Repository; // 프로젝트에 맞춰 유지 (가능하면 repository 로 소문자 권장)

import com.example.chat.domain.DmMessage; // ✅ 소문자 domain import
import com.example.chat.domain.DmThread;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DmMessageRepository extends JpaRepository<DmMessage, Long> {

    List<DmMessage> findByThreadIdAndCreatedAtBefore(Long threadId, LocalDateTime createdAt, Pageable pageable);

    Optional<DmMessage> findFirstByThreadIdOrderByCreatedAtDesc(Long threadId);

    List<DmMessage> findByThreadIdOrderByCreatedAtDesc(Long threadId, Pageable pageable);
}
