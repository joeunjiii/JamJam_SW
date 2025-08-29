package com.example.chat.Domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;

@Entity
@Table(name = "dm_messasge",
    indexes = {
            @Index(name = "ix_dmmsg_thread_time", columnList = "thread_id, created_at"),
            @Index(name = "ix_dmmsg_sender_time", columnList = "sender_id, created_at")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_dmmsg_thread"))
    private DmThread Thread;

    @Column(name = "sender_id", nullable = false)
    private Long senId;

    @Column(name = "body", columnDefinition = "MEDIUMTEXT")
    private String body;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prepersist() {
        if(createdAt == null) createdAt = LocalDateTime.now();
    }

}
