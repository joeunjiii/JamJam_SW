// src/main/java/com/example/auth/oauth/OAuth2SuccessHandler.java
package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import com.example.auth.user.Member;
import com.example.auth.user.MemberRepository;
import com.example.auth.user.Provider;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final OneTimeCodeService oneTimeCodeService; // 모바일 딥링크용 1회용 코드 서비스
    private final MemberRepository memberRepository;

    // 예) JamJam://oauth/success  (모바일 앱 딥링크)
    @Value("${app.post-login.mobile-deeplink:}")
    private String mobileDeepLink;

    // 예) http://localhost:8081/oauth/success  (웹 성공 페이지)
    @Value("${app.web.success-url}")
    private String webSuccessUrl;

    @PostConstruct
    void validateConfig() {
        // 웹 성공 URL은 필수
        if (isBlank(webSuccessUrl)) {
            throw new IllegalStateException("Missing required property: app.web.success-url");
        }
        // 모바일 딥링크는 선택(없어도 웹으로 동작 가능)
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attrs = oAuth2User.getAttributes();

        // --- 1) 프로바이더 판별 & 표준 필드 추출 ---
        Provider provider;
        String providerUserId;
        String nickname = null;
        String email = null;
        String imageUrl = null;

        if (attrs.containsKey("sub")) {
            // Google 표준 클레임
            provider = Provider.GOOGLE;
            providerUserId = String.valueOf(attrs.get("sub"));
            email = getAsString(attrs, "email");
            nickname = firstNonBlank(
                    getAsString(attrs, "name"),
                    getAsString(attrs, "given_name"),
                    "GoogleUser"
            );
            imageUrl = getAsString(attrs, "picture");
        } else {
            // Kakao 응답 구조
            provider = Provider.KAKAO;
            providerUserId = String.valueOf(attrs.get("id"));
            Map<String, Object> account = getAsMap(attrs, "kakao_account");
            Map<String, Object> profile = getAsMap(account, "profile");

            nickname = firstNonBlank(
                    getAsString(profile, "nickname"),
                    "KakaoUser"
            );
            imageUrl = getAsString(profile, "profile_image_url");
            email = getAsString(account, "email");
        }

        // --- 2) 회원 조회/생성 및 정보 갱신 ---
        Member m = memberRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .orElseGet(Member::new);

        if (m.getId() == null) {
            m.setProvider(provider);
            m.setProviderUserId(providerUserId);
            m.setJoinedAt(LocalDateTime.now());
        }
        m.setEmail(email);
        m.setNickname(nickname);
        m.setProfileImageUrl(imageUrl);
        m.setLastLoginAt(LocalDateTime.now());

        memberRepository.save(m);

        log.info("✅ OAuth2SuccessHandler - provider={}, providerUserId={}, memberId={}, nickname={}",
                provider, providerUserId, m.getId(), nickname);

        // --- 3) 웹/모바일 분기 ---
        boolean forceWeb = request.getParameter("web") != null;     // 강제 웹 분기 파라미터
        boolean looksLikeExpo = looksLikeExpoWeb(request);          // Expo Web/Go 등 브라우저성
        boolean canUseMobileDeeplink = !isBlank(mobileDeepLink);    // 모바일 딥링크 설정 여부

        if (forceWeb || looksLikeExpo || !canUseMobileDeeplink) {
            // ✅ 브라우저(웹) → JWT 즉시 부여 후 웹 성공 URL로 리다이렉트

            String token = jwtUtil.createAccessToken(
                    String.valueOf(m.getId()),
                    JwtUtil.Audience.WEB,
                    Map.of("nickname", Optional.ofNullable(nickname).orElse("user"))
            );

            String redirect = UriComponentsBuilder
                    .fromUriString(webSuccessUrl) // 반드시 fromUriString (스킴이 http/https)
                    .queryParam("token_type", "Bearer")
                    .queryParam("access_token", token)
                    .queryParam("expires_in", jwtUtil.getAccessTtlMs() / 1000)
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();

            log.info("🔁 Redirect to WEB success URL: {}", redirect);
            response.sendRedirect(redirect);
            return;
        }

        // ✅ 모바일 앱 → One-Time Code 발급 + 딥링크 리다이렉트
        String code = oneTimeCodeService.issueForUser(
                String.valueOf(m.getId()),
                Map.of(
                        "nickname", Optional.ofNullable(nickname).orElse("user"),
                        "email", Optional.ofNullable(email).orElse("")
                ),
                Duration.ofMinutes(2)
        );

        String redirect = UriComponentsBuilder
                .fromUriString(mobileDeepLink) // 커스텀 스킴/호스트 가능 (JamJam://oauth/success)
                .queryParam("code", code)
                .build(true) // raw 유지
                .toUriString();

        log.info("🔁 Redirect to MOBILE deeplink: {}", redirect);
        response.sendRedirect(redirect);
    }

    // ========= 도우미 메서드들 =========

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String firstNonBlank(String... vals) {
        for (String v : vals) {
            if (!isBlank(v)) return v;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> getAsMap(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        if (v instanceof Map<?, ?> mm) {
            return (Map<String, Object>) mm;
        }
        return Map.of();
    }

    private static String getAsString(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return (v instanceof String) ? (String) v : null;
    }

    private boolean looksLikeExpoWeb(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        // Expo Go/웹, 일반 브라우저 모두 웹로 가야 하는 케이스로 취급
        return ua != null && (
                ua.contains("Expo") ||
                        ua.toLowerCase().contains("mozilla") ||
                        ua.toLowerCase().contains("chrome") ||
                        ua.toLowerCase().contains("safari")
        );
    }
}
