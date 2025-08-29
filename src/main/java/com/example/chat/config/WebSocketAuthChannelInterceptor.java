package com.example.chat.config;

import com.example.auth.config.UserPrincipal;
import com.example.auth.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import java.security.Principal;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (acc == null) return message;

        // STOMP CONNECT에서만 인증 처리
        if (StompCommand.CONNECT.equals(acc.getCommand())) {
            String auth = firstHeader(acc, "Authorization");
            if (auth == null || !auth.regionMatches(true, 0, "Bearer ", 0, 7)) {
                log.warn("[WS][AUTH] Missing/invalid Authorization header");
                return message; // 필요 시 예외 던져서 차단 가능
            }
            String token = auth.substring(7).trim();
            if (token.isBlank() || "null".equalsIgnoreCase(token) || "undefined".equalsIgnoreCase(token)) {
                log.warn("[WS][AUTH] Placeholder token: {}", token);
                return message;
            }

            try {
                // 우선 WEB aud 검증, 실패 시 MOBILE 시도 (당신의 JwtAuthenticationFilter와 동일 전략)
                Claims claims;
                try {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.WEB);
                } catch (JwtException e) {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.MOBILE);
                }

                String userId = claims.getSubject();
                String nickname = claims.get("nickname", String.class);

                // STOMP에 주입할 Principal — getName()이 userId를 반환하도록 통일
                Principal principal = new UserPrincipal(userId, nickname);
                acc.setUser(principal);

                log.info("[WS][AUTH] CONNECT OK userId={} aud={}", userId, claims.getAudience());
            } catch (JwtException e) {
                log.warn("[WS][AUTH] Token verification failed: {}", e.getMessage());
                // 여기서 예외 던지면 CONNECT 자체를 거부하게 됨:
                // throw new IllegalArgumentException("Invalid token");
                // 지금은 부드럽게 통과시키되, 보호 리소스에서 거부되도록 둠.
            }
        }

        return message;
    }

    private String firstHeader(StompHeaderAccessor acc, String name) {
        List<String> values = acc.getNativeHeader(name);
        return (values != null && !values.isEmpty()) ? values.get(0) : null;
    }
}
