package com.example.chat.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResult {
    private Long userId;
    private String nickname;
    private String profileImageUrl;
    private boolean isOnline;

    public UserSearchResult(Long userId, String nickname, String profileImageUrl) {
        this.userId = userId;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.isOnline = false;
    }
}

