package com.example.chat.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    // HS256 시크릿 (운영환경에선 환경변수/Secret Manager 사용)
    @Value("${security.jwt.secret:change-me-in-prod-please-32bytes-minimum}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Jws<Claims> parse(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    public boolean isExpired(Claims claims) {
        Date exp = claims.getExpiration();
        return exp != null && exp.before(new Date());
    }

    /** sub를 userId(Long)로 변환 */
    public Long extractUserId(Claims claims) {
        // 토큰 예시: "sub": "8"
        String sub = claims.getSubject();
        if (sub == null) return null;
        try { return Long.valueOf(sub); }
        catch (NumberFormatException e) { return null; }
    }

    /** 선택: 닉네임 같은 커스텀 클레임 접근 */
    public String extractNickname(Claims claims) {
        Object val = claims.get("nickname");
        return val != null ? String.valueOf(val) : null;
    }

    /** 전체 클레임 맵으로 노출 (필요시 사용) */
    public Map<String, Object> toMap(Claims claims) {
        return claims;
    }
}
