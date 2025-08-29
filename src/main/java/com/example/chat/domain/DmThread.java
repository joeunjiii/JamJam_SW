package com.example.chat.domain; // ✅ 소문자 'domain'

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dm_thread",
        uniqueConstraints = @UniqueConstraint(name = "uq_dm_pair",
                columnNames = {"user1_id","user2_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder // ✅ @Getter 추가
public class DmThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thread_id")
    private Long id;

    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    @Column(name = "user2_id", nullable = false)
    private Long user2Id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (user1Id != null && user2Id != null && user1Id > user2Id) {
            long t = user1Id; user1Id = user2Id; user2Id = t;
        }
    }
}
