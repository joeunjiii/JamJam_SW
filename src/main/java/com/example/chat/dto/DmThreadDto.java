package com.example.chat.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DmThreadDto {
    private Long threadId;
    private Long user1Id;
    private Long user2Id;
    private LocalDateTime createdAt;
}
