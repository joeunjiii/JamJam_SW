package com.example.jamjam.Controller;

import com.example.jamjam.DTO.PostRequestDTO;
import com.example.jamjam.DTO.PostResponseDTO;
import com.example.jamjam.Service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    // 글쓰기
    @PostMapping
    public PostResponseDTO createPost(@RequestBody PostRequestDTO dto) {
        return postService.createPost(dto);
    }

    // 목록 조회
    @GetMapping
    public Page<PostResponseDTO> getPosts(
            @RequestParam(defaultValue = "all") String board,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return postService.getPosts(board, page, size);
    }

    // 상세 조회
    @GetMapping("/{id}")
    public PostResponseDTO getPostDetail(@PathVariable Long id) {
        return postService.getPostDetail(id);
    }
}

