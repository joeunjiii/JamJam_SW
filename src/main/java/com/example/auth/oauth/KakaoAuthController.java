package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import com.example.auth.user.Member;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/kakao")
public class KakaoAuthController {

    private final KakaoOAuthService kakaoOAuthService;
    private final JwtUtil jwtUtil;

    @PostMapping("/exchange")
    public ResponseEntity<?> exchange(@RequestBody ExchangeRequest req) {
        // 1) 인가코드 → 카카오 토큰 교환 (redirectUri 검증 포함)
        KakaoTokenResponse token = kakaoOAuthService.exchangeCodeForToken(req.code, req.redirectUri);

        // 2) 사용자 정보 조회 + 회원 upsert
        Member m = kakaoOAuthService.upsertMemberByAccessToken(token.getAccessToken());

        // 3) 서버 JWT 발급 (모바일 Audience)
        String jwt = jwtUtil.createAccessToken(
                String.valueOf(m.getId()),
                JwtUtil.Audience.MOBILE,
                Map.of("nickname", m.getNickname() == null ? "user" : m.getNickname())
        );

        long expiresIn = jwtUtil.getAccessTtlMs() / 1000;
        return ResponseEntity.ok(Map.of(
                "token_type", "Bearer",
                "access_token", jwt,
                "expires_in", expiresIn
        ));
    }

    @Data
    public static class ExchangeRequest {
        public String code;
        public String redirectUri; // 프런트가 AuthSession.makeRedirectUri({useProxy:true})로 만든 값
    }
}
