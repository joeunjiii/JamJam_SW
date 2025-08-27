package com.example.jamjam.DTO;

import com.example.jamjam.Entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponseDTO {
    private Long id;
    private Long userId;
    private String nickname;
    private String gender;
    private String parentingStatus;
    private LocalDate dueDate;
    private String profileImageUrl;
    private List<ChildResponseDTO> children;

    private LocalDateTime createdAt;   // ✅ 가입 시기 추가

    public static ProfileResponseDTO fromEntity(UserProfile profile) {
        return ProfileResponseDTO.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .nickname(profile.getNickname())
                .gender(profile.getGender().getDisplayName())
                .parentingStatus(profile.getParentingStatus().getDisplayName())
                .dueDate(profile.getDueDate())
                .profileImageUrl(profile.getProfileImageUrl())
                .children(profile.getChildren().stream()
                        .map(ChildResponseDTO::fromEntity)
                        .toList())
                .createdAt(profile.getCreatedAt())   // ✅ 엔티티에서 값 가져오기
                .build();
    }
}
