package com.example.auth.oauth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KakaoTokenResponse {
    @JsonProperty("token_type")
    private String tokenType; // "bearer"
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("expires_in")
    private Long expiresIn; // seconds
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("refresh_token_expires_in")
    private Long refreshTokenExpiresIn; // seconds
    private String scope; // optional
}