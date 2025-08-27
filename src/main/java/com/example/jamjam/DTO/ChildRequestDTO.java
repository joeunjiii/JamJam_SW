package com.example.jamjam.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// 자녀 정보 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildRequestDTO {
    private String name;
    private LocalDate birthDate;
    private String gender; // "남성" 또는 "여성"
}
