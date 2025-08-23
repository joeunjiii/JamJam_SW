package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import com.example.auth.user.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;
    private final OneTimeCodeService oneTimeCodeService;

    @Value("${app.post-login.mobile-deeplink}")
    private String mobileDeepLink; // 예: JamJam://oauth/success

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attrs = oAuth2User.getAttributes();

        // 공급자 판별 & 프로필 추출
        Provider provider;
        String providerUserId;
        String email = null;
        String nickname = null;
        String imageUrl = null;

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
            // Kakao는 email 동의 안 하면 null일 수 있음
            if (account.get("email") instanceof String e) email = e;
        }

        // upsert
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

        // 1회용 코드 발급
        Map<String, Object> extra = new HashMap<>();
        if (m.getNickname() != null) extra.put("nickname", m.getNickname());
        if (m.getEmail() != null) extra.put("email", m.getEmail());
        String code = oneTimeCodeService.issueForUser(String.valueOf(m.getId()), extra, Duration.ofMinutes(2));

        String redirect = mobileDeepLink + "?code=" + URLEncoder.encode(code, StandardCharsets.UTF_8);
        response.sendRedirect(redirect);
    }
}
