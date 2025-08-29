package com.example.chat.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebSocketResponse {
    private boolean success;
    private String type;
    private String message;
    private Object data;

    public static WebSocketResponse success(String type, Object data) {
        return WebSocketResponse.builder()
                .success(true)
                .type(type)
                .data(data)
                .build();
    }

    public static WebSocketResponse error(String type, String message) {
        return WebSocketResponse.builder()
                .success(false)
                .type(type)
                .message(message)
                .build();
    }
}
