package com.example.jamjam.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildResponseDTO {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private String gender;

    public static ChildResponseDTO fromEntity(com.example.jamjam.Entity.Child child) {
        return ChildResponseDTO.builder()
                .id(child.getId())
                .name(child.getName())
                .birthDate(child.getBirthDate())
                .gender(child.getGender().getDisplayName())
                .build();
    }
}
