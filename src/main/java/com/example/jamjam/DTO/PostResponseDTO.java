package com.example.jamjam.DTO;

import com.example.jamjam.Entity.Post;
import com.example.jamjam.Entity.PostMedia;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponseDTO {
    private Long postId;
    private String title;
    private String body;
    private String board;
    private Long authorId;
    private String nickname;
    private LocalDateTime createdAt;
    private List<String> mediaUrls;

    public static PostResponseDTO fromEntity(Post post) {
        return PostResponseDTO.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .body(post.getBody())
                .board(post.getBoard())
                .authorId(post.getAuthor().getId())          // ✅ Member PK
                .nickname(post.getAuthor().getNickname())    // ✅ 닉네임
                .createdAt(post.getCreatedAt())
                .mediaUrls(post.getMedia() == null ? List.of() :
                        post.getMedia().stream().map(PostMedia::getFileUrl).toList())
                .build();
    }
}
