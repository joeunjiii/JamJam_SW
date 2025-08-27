package com.example.jamjam.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class PostResponseDTO {
    private Long postId;
    private String title;
    private String body;
    private String board;
    private Long authorId;
    private LocalDateTime createdAt;
    private List<String> mediaUrls;
}
