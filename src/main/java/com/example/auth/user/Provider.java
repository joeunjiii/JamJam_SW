package com.example.auth.user;

import lombok.Getter;

@Getter
public enum Provider {
    KAKAO(1), GOOGLE(2);

    private final int code;
    Provider(int code) { this.code = code; }

    public static Provider fromCode(int code) {
        return switch (code) {
            case 1 -> KAKAO;
            case 2 -> GOOGLE;
            default -> throw new IllegalArgumentException("Unknown provider code: " + code);
        };
    }
}
