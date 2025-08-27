package com.example.jamjam.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequestDTO {
    private String nickname;
    private String gender; // "남성" 또는 "여성"
    private String status; // "출산예정", "육아 중", "해당사항 없음", "둘다"
    private LocalDate dueDate;
    private String profileImageUrl;
    private List<ChildRequestDTO> children;
}