package com.example.chat.Repository;

import com.example.chat.Domain.DmMessage;
import com.example.chat.Domain.DmThread;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DmMessageRepository extends JpaRepository<DmMessage, Long> {
    List<DmMessage> findByThreadOrderById(DmThread thread, Pageable pageable);
}
