package com.example.chat.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DmThreadWithLastMessage {
    private Long threadId;
    private Long otherUserId;
    private String otherUserNickname;
    private String otherUserProfileImage;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private int unreadCount;
}
