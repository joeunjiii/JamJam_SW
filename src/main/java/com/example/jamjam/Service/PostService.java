package com.example.jamjam.Service;

import com.example.jamjam.DTO.PostRequestDTO;
import com.example.jamjam.DTO.PostResponseDTO;
import com.example.auth.user.Member;
import com.example.jamjam.Entity.Post;
import com.example.jamjam.Entity.PostMedia;
import com.example.auth.user.MemberRepository;
import com.example.jamjam.Repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;   // ✅ authorId → Member 조회용

    @Transactional
    public PostResponseDTO createPost(PostRequestDTO dto) {
        Member author = memberRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Post post = Post.builder()
                .author(author)                         // ✅ Member 세팅
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
                            ).toList()
            );
        }

        Post saved = postRepository.save(post);
        return PostResponseDTO.fromEntity(saved);
    }

    public Page<PostResponseDTO> getPosts(String board, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts;
        if (board.equals("all")) {
            posts = postRepository.findAll(pageable);
        } else {
            posts = postRepository.findByBoard(board, pageable);
        }
        return posts.map(PostResponseDTO::fromEntity);
    }

    public PostResponseDTO getPostDetail(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return PostResponseDTO.fromEntity(post);
    }
}
