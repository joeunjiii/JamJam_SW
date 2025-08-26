package com.example.auth.oauth;

import com.example.auth.user.Member;
import com.example.auth.user.MemberRepository;
import com.example.auth.user.Provider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    private final WebClient webClient;
    private final MemberRepository memberRepository;

    @Value("${kakao.rest-api-key}")
    private String restApiKey;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-uri}")
    private String tokenUri;

    @Value("${kakao.user-info-uri}")
    private String userInfoUri;

    public KakaoTokenResponse exchangeCodeForToken(String code, String clientRedirectUri) {
        // ✅ 등록된 redirectUri 중 하나인지 확인만 (엄격 비교 대신 허용 리스트)
        if (clientRedirectUri == null || clientRedirectUri.isBlank()) {
            throw new IllegalArgumentException("redirect_uri is missing");
        }

        // 허용된 redirect URIs
        List<String> allowedUris = List.of(
                "https://auth.expo.io/@jonjijo/JamJam",
                "http://43.201.211.116:8082/login/oauth2/code/kakao"
        );

        if (!allowedUris.contains(clientRedirectUri)) {
            throw new IllegalArgumentException("redirect_uri not allowed: " + clientRedirectUri);
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", restApiKey);
        form.add("redirect_uri", clientRedirectUri); // ✅ 프런트에서 보낸 값을 그대로 사용
        form.add("code", code);

        return webClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue(form)
                .retrieve()
                .bodyToMono(KakaoTokenResponse.class)
                .doOnError(e -> log.error("카카오 토큰 교환 실패", e))
                .blockOptional()
                .orElseThrow(() -> new IllegalStateException("Empty token response from Kakao"));
    }

    @SuppressWarnings("unchecked")
    public Member upsertMemberByAccessToken(String accessToken) {
        Map<String, Object> info = webClient.get()
                .uri(userInfoUri)
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(Map.class)
                .blockOptional()
                .orElseThrow(() -> new IllegalStateException("Empty userinfo"));

        String providerUserId = String.valueOf(info.get("id"));
        Map<String, Object> account = (Map<String, Object>) info.getOrDefault("kakao_account", Map.of());
        Map<String, Object> profile = (Map<String, Object>) account.getOrDefault("profile", Map.of());

        String nickname = (String) profile.getOrDefault("nickname", "KakaoUser");
        String imageUrl = (String) profile.get("profile_image_url");
        String email = (String) account.get("email");

        Member m = memberRepository.findByProviderAndProviderUserId(Provider.KAKAO, providerUserId)
                .orElseGet(com.example.auth.user.Member::new);

        if (m.getId() == null) {
            m.setProvider(Provider.KAKAO);
            m.setProviderUserId(providerUserId);
            m.setJoinedAt(LocalDateTime.now());
        }
        m.setNickname(Optional.ofNullable(nickname).orElse("KakaoUser"));
        m.setProfileImageUrl(imageUrl);
        m.setEmail(email);
        m.setLastLoginAt(LocalDateTime.now());

        memberRepository.save(m);
        return m;
    }
}
