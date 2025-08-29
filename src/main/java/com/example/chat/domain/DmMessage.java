package com.example.chat.domain; // ✅ 소문자 'domain'로 통일

import jakarta.persistence.*;
import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dm_message",
        indexes = {
                @Index(name = "ix_dmmsg_thread_time", columnList = "thread_id, created_at"),
                @Index(name = "ix_dmmsg_sender_time", columnList = "sender_id, created_at")
        })
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DmMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "thread_id", nullable = false)
    private Long threadId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "body", columnDefinition = "MEDIUMTEXT")
    private String body;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
