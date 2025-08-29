package com.example.chat.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DmMessageDto {
    private Long messageId;
    private Long threadId;
    private Long senderId;
    private String body;
    private String fileUrl;
    private LocalDateTime createdAt;
}
