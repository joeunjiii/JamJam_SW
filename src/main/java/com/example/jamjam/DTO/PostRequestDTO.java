package com.example.jamjam.DTO;

import lombok.Data;
import java.util.List;

@Data
public class PostRequestDTO {
    private Long authorId;
    private String board;
    private String title;
    private String body;
    private List<String> mediaUrls; // 파일 업로드 후 URL 리스트
}
