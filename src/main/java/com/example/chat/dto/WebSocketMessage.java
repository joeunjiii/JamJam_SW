package com.example.chat.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebSocketMessage {
    private String type;  // CHAT, ACK, ERROR, TYPING, etc.
    private Long threadId;
    private Long messageId;
    private String clientMsgId;
    private Long senderId;
    private String body;
    private String fileUrl;
    private LocalDateTime createdAt;

    // Error fields
    private String errorCode;
    private String errorMessage;

    // Generic data field
    private Map<String, Object> data;
}
