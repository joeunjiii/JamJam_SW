package com.example.auth.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", indexes = {
        @Index(columnList = "provider,providerId", unique = true)
})
public class User {
    @Id
    private String id; // UUID 문자열

    private String provider;   // google/kakao
    private String providerId; // sub / kakao id

    private String email;
    private String username; // spec: username
    private String nickname;

    private Instant createdAt = Instant.now();
}
