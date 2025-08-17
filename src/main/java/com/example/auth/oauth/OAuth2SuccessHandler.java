package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import com.example.auth.user.User;
import com.example.auth.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = request.getRequestURI().contains("google") ? "google" : "kakao"; // 보완 필요

        Map<String, Object> attrs = oAuth2User.getAttributes();
        // 구글/카카오 매핑
        String providerId;
        String email = null;
        String nickname = null;
        String username = null;

        if ("google".equals(registrationId) || attrs.containsKey("sub")) {
            providerId = String.valueOf(attrs.get("sub"));
            email = (String) attrs.get("email");
            nickname = (String) attrs.getOrDefault("name", null);
            username = email != null ? email.split("@")[0] : providerId;
        } else {
            // kakao
            providerId = String.valueOf(attrs.get("id"));
            Map<String, Object> account = (Map<String, Object>) attrs.getOrDefault("kakao_account", Map.of());
            Map<String, Object> profile = (Map<String, Object>) account.getOrDefault("profile", Map.of());
            email = (String) account.get("email");
            nickname = (String) profile.getOrDefault("nickname", "KakaoUser");
            username = email != null ? email.split("@")[0] : nickname;
        }

        // 유저 upsert
        User user = userRepository.findByProviderAndProviderId(registrationId, providerId)
                .orElseGet(() -> new User());
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
            user.setProvider(registrationId);
            user.setProviderId(providerId);
        }
        user.setEmail(email);
        user.setUsername(username);
        user.setNickname(nickname);
        userRepository.save(user);

        // JWT 발급 (spec: /auth/profile 에서 Bearer 토큰 사용)
        String token = jwtUtil.createToken(user.getId(), Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "nickname", user.getNickname()
        ));

        // FE로 리다이렉트 (쿼리 전달)
        String url = redirectUri + "?token=" + token;
        response.sendRedirect(url);
    }
}
