package com.example.chat.Repository;

import com.example.chat.domain.DmThread; // ✅ 소문자 domain import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DmThreadRepository extends JpaRepository<DmThread, Long> {
    Optional<DmThread> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    @Query("SELECT t FROM DmThread t WHERE t.user1Id = :userId OR t.user2Id = :userId")
    List<DmThread> findByUserId(@Param("userId") Long userId);
}
