package com.example.jamjam.Service;

import com.example.jamjam.DTO.PostRequestDTO;
import com.example.jamjam.DTO.PostResponseDTO;
import com.example.jamjam.Entity.Post;
import com.example.jamjam.Entity.PostMedia;
import com.example.jamjam.Repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public PostResponseDTO createPost(PostRequestDTO dto) {
        Post post = Post.builder()
                .authorId(dto.getAuthorId())
                .board(dto.getBoard())
                .title(dto.getTitle())
                .body(dto.getBody())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (dto.getMediaUrls() != null) {
            post.setMedia(
                    dto.getMediaUrls().stream()
                            .map(url -> PostMedia.builder()
                                    .fileUrl(url)
                                    .sortOrder(1)
                                    .post(post)
                                    .build()
                            ).collect(Collectors.toList())
            );
        }

        Post saved = postRepository.save(post);

        return toDto(saved);
    }

    public Page<PostResponseDTO> getPosts(String board, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts;
        if (board.equals("all")) {
            posts = postRepository.findAll(pageable);
        } else {
            posts = postRepository.findByBoard(board, pageable);
        }
        return posts.map(this::toDto);
    }

    public PostResponseDTO getPostDetail(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return toDto(post);
    }

    private PostResponseDTO toDto(Post post) {
        return PostResponseDTO.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .body(post.getBody())
                .board(post.getBoard())
                .authorId(post.getAuthorId())
                .createdAt(post.getCreatedAt())
                .mediaUrls(post.getMedia() == null ? List.of() :
                        post.getMedia().stream().map(PostMedia::getFileUrl).toList())
                .build();
    }
}
