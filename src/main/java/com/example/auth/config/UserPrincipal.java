package com.example.auth.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;


public record UserPrincipal(String userId, String nickname) implements Principal {
    @Override
    public String getName() {
        return userId; // Spring의 Principal.getName()이 userId를 반환하도록 통일
    }
}