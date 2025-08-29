package com.example.chat.security;

import com.example.chat.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.security.Principal;
import java.util.Collections;

@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // STOMP CONNECT일 때만 인증 처리
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String auth = firstNativeHeader(accessor, "Authorization");
            if (auth == null || auth.isBlank()) {
                log.warn("[WS][AUTH] Missing Authorization header in CONNECT");
                return message; // 필요 시 예외 던져 차단
            }

            String token = extractBearerToken(auth);
            if (token == null) {
                log.warn("[WS][AUTH] Invalid Authorization format (expect Bearer)");
                return message; // 필요 시 예외 던져 차단
            }

            try {
                Jws<Claims> jws = jwtTokenProvider.parse(token);
                Claims claims = jws.getBody();

                if (jwtTokenProvider.isExpired(claims)) {
                    log.warn("[WS][AUTH] Token expired");
                    return message; // 필요 시 예외
                }

                Long userId = jwtTokenProvider.extractUserId(claims);
                if (userId == null) {
                    log.warn("[WS][AUTH] Missing/invalid sub (userId)");
                    return message; // 필요 시 예외
                }

                // Authorities가 있다면 여기에 주입 가능
                Principal principal = new UsernamePasswordAuthenticationToken(
                        String.valueOf(userId),
                        null,
                        Collections.emptyList()
                );
                accessor.setUser(principal);

                // 보안상 전체 토큰 로깅 금지(프리픽스 일부만 출력)
                log.info("[WS][AUTH] CONNECT ok userId={} (aud={})",
                        userId, claims.getAudience());

            } catch (JwtException e) {
                log.warn("[WS][AUTH] Invalid JWT: {}", e.getMessage());
                return message; // 필요 시 예외
            }
        }

        return message;
    }

    private String firstNativeHeader(StompHeaderAccessor accessor, String name) {
        var values = accessor.getNativeHeader(name);
        return (values != null && !values.isEmpty()) ? values.get(0) : null;
    }

    private String extractBearerToken(String authorization) {
        String prefix = "Bearer ";
        if (authorization.regionMatches(true, 0, prefix, 0, prefix.length())) {
            return authorization.substring(prefix.length()).trim();
        }
        return null;
    }
}