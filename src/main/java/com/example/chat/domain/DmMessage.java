package com.example.chat.domain; // ✅ 소문자 'domain'로 통일

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dm_message", // ✅ 오타 수정: dm_messasge -> dm_message
        indexes = {
                @Index(name = "ix_dmmsg_thread_time", columnList = "thread_id, created_at"),
                @Index(name = "ix_dmmsg_sender_time", columnList = "sender_id, created_at")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DmMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")           // (선택) 명시적으로 컬럼명 지정
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_dmmsg_thread"))
    private DmThread thread;               // ✅ 필드명은 'thread' (파생쿼리 규칙)

    @Column(name = "sender_id", nullable = false)
    private Long senderId;                 // ✅ 필드명은 'senderId' (서비스/DTO와 일치)

    @Column(name = "body", columnDefinition = "MEDIUMTEXT")
    private String body;

    @Column(name = "file_url", length = 500)
    private String fileUrl;                // ✅ getFileUrl() 생성됨

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
