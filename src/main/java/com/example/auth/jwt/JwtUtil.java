package com.example.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Component
public class JwtUtil {

    // === 권장: iss(발급자) 고정, aud(수신자=채널) 분리 ===
    public static final String ISSUER = "jamjam-auth";
    public enum Audience { WEB, MOBILE }
    public enum TokenType { ACCESS, REFRESH, EXCHANGE_CODE }

    @Getter
    private final long accessTtlMs;
    @Getter
    private final long refreshTtlMs;
    @Getter
    private final long exchangeCodeTtlMs;

    private final SecretKey key;  // HS256 키 (최소 256bit)
    private final JwtParser strictParser;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,                   // 32바이트 이상 권장
            @Value("${app.jwt.access-ttl-ms:3600000}") long accessTtlMs, // 1h
            @Value("${app.jwt.refresh-ttl-ms:1209600000}") long refreshTtlMs, // 14d
            @Value("${app.jwt.exchange-ttl-ms:120000}") long exchangeCodeTtlMs // 2m (모바일 코드교환용)
    ) {
        this.key = deriveKey(secret);
        this.accessTtlMs = accessTtlMs;
        this.refreshTtlMs = refreshTtlMs;
        this.exchangeCodeTtlMs = exchangeCodeTtlMs;

        // 만료/서명/issuer까지 엄격 검증하는 파서
        this.strictParser = Jwts.parserBuilder()
                .requireIssuer(ISSUER)
                .setSigningKey(this.key)
                .build();
    }

    // secret 가 base64인지 평문인지 판단 후 SecretKey 생성
    private SecretKey deriveKey(String secret) {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length >= 32) return Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException ignore) { /* not base64 */ }
        byte[] raw = secret.getBytes(StandardCharsets.UTF_8);
        if (raw.length < 32) {
            throw new IllegalArgumentException("app.jwt.secret must be at least 32 bytes (256 bits).");
        }
        return Keys.hmacShaKeyFor(raw);
    }

    // 공통 빌더
    private JwtBuilder baseBuilder(String subject, TokenType type, Audience aud, long ttlMs, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + ttlMs);
        JwtBuilder b = Jwts.builder()
                .setId(UUID.randomUUID().toString())   // jti
                .setIssuer(ISSUER)                     // iss
                .setSubject(subject)                   // sub (ex: userId)
                .setAudience(aud.name())               // aud: WEB|MOBILE
                .claim("typ", type.name())             // custom: 토큰 타입
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256);
        if (extraClaims != null && !extraClaims.isEmpty()) b.addClaims(extraClaims);
        return b;
    }

    // === 발급 전용 메서드 ===

    /** 웹/모바일 공통 액세스 토큰 */
    public String createAccessToken(String userId, Audience aud, Map<String, Object> claims) {
        return baseBuilder(userId, TokenType.ACCESS, aud, accessTtlMs, claims).compact();
    }

    /** 리프레시 토큰 (서버 저장/블랙리스트 관리 전제) */
    public String createRefreshToken(String userId, Audience aud, Map<String, Object> claims) {
        return baseBuilder(userId, TokenType.REFRESH, aud, refreshTtlMs, claims).compact();
    }

    /** 모바일 전용: 앱으로 전달할 One-Time EXCHANGE_CODE (딥링크에는 코드만) */
    public String createExchangeCode(String userId, Map<String, Object> claims) {
        // aud=MOBILE 고정, 매우 짧은 만료
        return baseBuilder(userId, TokenType.EXCHANGE_CODE, Audience.MOBILE, exchangeCodeTtlMs, claims).compact();
    }

    // === 파싱/검증 ===

    /** 만료/서명/발급자 검증까지 포함한 엄격 파싱 */
    public Jws<Claims> parseStrict(String token) {
        return strictParser.parseClaimsJws(token);
    }

    /** 토큰 타입/채널까지 함께 검증 */
    public Claims verify(String token, TokenType expectedType, Audience expectedAud) {
        Jws<Claims> jws = parseStrict(token);
        Claims c = jws.getBody();
        String typ = Objects.toString(c.get("typ"), null);
        if (!expectedType.name().equals(typ)) {
            throw new JwtException("Unexpected token type: " + typ);
        }
        return c; // aud는 안 봄
    }

    // === 웹용 쿠키 헬퍼 (HttpOnly/SameSite/secure 설정) ===

    /** ACCESS 토큰을 HttpOnly 쿠키로 내려줄 때 사용 (웹 플로우) */
    public ResponseCookie buildAccessCookie(String name, String jwt, boolean secure, String domain) {
        return ResponseCookie.from(name, jwt)
                .httpOnly(true)
                .secure(secure) // 운영: true(HTTPS), 로컬 테스트: false
                .sameSite("Lax") // SPA라면 Lax/None 중 선택(크로스 도메인면 None+secure)
                .path("/")
                .domain(domain) // 로컬은 생략 가능
                .maxAge(Duration.ofMillis(accessTtlMs))
                .build();
    }

    /** 쿠키 제거용 */
    public ResponseCookie deleteCookie(String name, boolean secure, String domain) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .domain(domain)
                .maxAge(0)
                .build();
    }

    // === 안전한 랜덤 코드 생성(필요 시) ===
    public String randomOpaqueCode(int bytes) {
        byte[] buf = new byte[bytes];
        new SecureRandom().nextBytes(buf);
        return Encoders.BASE64URL.encode(buf); // URL-safe, padding 없음
    }
}
