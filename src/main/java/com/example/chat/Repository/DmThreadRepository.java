package com.example.chat.Repository;

import com.example.chat.Domain.DmThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DmThreadRepository extends JpaRepository<DmThread, Long> {

    Optional<DmThread> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
}
