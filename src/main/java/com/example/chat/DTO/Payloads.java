package com.example.chat.DTO;

import lombok.*;

import java.time.OffsetDateTime;

public class Payloads {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WsChatSend{
        private Long threadId;
        private String body;
        private String fileUser;
        private String clientMsgId;
        private OffsetDateTime sendAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WsChatEvent{
        private String type;          // "CHAT","ACK","ERROR","PING","PONG"
        private Long threadId;
        private Long messageId;       // CHAT일 때
        private Long senderId;
        private String body;
        private String fileUrl;
        private String clientMsgId;   // ACK echo
        private String errorCode;     // ERROR
        private String errorMessage;  // ERROR
        private OffsetDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ThreadResponse {
        private Long threadId;
        private Long otherUserId;
        private Long me;
        private OffsetDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private Long messageId;
        private Long threadId;
        private Long senderId;
        private String body;
        private String fileUrl;
        private OffsetDateTime createdAt;
    }
}
