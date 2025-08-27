package com.example.jamjam.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_media")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PostMedia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mediaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    private Integer sortOrder;
}
