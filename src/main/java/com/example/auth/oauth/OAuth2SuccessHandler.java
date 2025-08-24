package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import com.example.auth.user.Member;
import com.example.auth.user.MemberRepository;
import com.example.auth.user.Provider;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final OneTimeCodeService oneTimeCodeService; // 이미 있으시면 그대로 사용
    private final MemberRepository memberRepository;

    @Value("${app.post-login.mobile-deeplink}")
    private String mobileDeepLink; // 예: JamJam://oauth/success

    @Value("${app.web.success-url}")
    private String webSuccessUrl;  // 예: http://localhost:8081/oauth2/success

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attrs = oAuth2User.getAttributes();

        String providerUserId;
        String nickname = null;
        String email = null;
        String imageUrl = null;
        Provider provider;

        if (attrs.containsKey("sub")) { // Google
            provider = Provider.GOOGLE;
            providerUserId = String.valueOf(attrs.get("sub"));
            email = (String) attrs.get("email");
            nickname = (String) attrs.getOrDefault("name", null);
            imageUrl = (String) attrs.get("picture");
        } else { // Kakao
            provider = Provider.KAKAO;
            providerUserId = String.valueOf(attrs.get("id"));
            Map<String, Object> account = (Map<String, Object>) attrs.getOrDefault("kakao_account", new HashMap<>());
            Map<String, Object> profile = (Map<String, Object>) account.getOrDefault("profile", new HashMap<>());
            nickname = (String) profile.getOrDefault("nickname", "KakaoUser");
            imageUrl = (String) profile.get("profile_image_url");
            if (account.get("email") instanceof String e) email = e;
        }

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

        log.info("✅ OAuth2SuccessHandler triggered - provider={}, userId={}, nickname={}",
                provider, providerUserId, nickname);

        String ua = request.getHeader("User-Agent");
        boolean isExpoGo = ua != null && ua.contains("Expo");

        if (isExpoGo || request.getParameter("web") != null) {
            // ✅ 브라우저/웹 테스트 → JWT 만들어 FE로 바로 리다이렉트
            String token = jwtUtil.createAccessToken(
                    String.valueOf(m.getId()),
                    JwtUtil.Audience.WEB,
                    Map.of("nickname", nickname == null ? "user" : nickname)
            );

            String redirect = UriComponentsBuilder
                    .fromHttpUrl(webSuccessUrl)       // ex) http://localhost:8081/oauth2/success
                    .queryParam("token", token)
                    .build(true)
                    .toUriString();

            response.sendRedirect(redirect);
        } else {
            // ✅ 모바일 앱 → One-Time Code + 딥링크
            Map<String, Object> extra = new HashMap<>();
            if (nickname != null) extra.put("nickname", nickname);
            if (email != null) extra.put("email", email);
            String code = oneTimeCodeService.issueForUser(String.valueOf(m.getId()), extra, Duration.ofMinutes(2));

            String redirect = mobileDeepLink + "?code=" + URLEncoder.encode(code, StandardCharsets.UTF_8);
            response.sendRedirect(redirect);
        }
    }
}
