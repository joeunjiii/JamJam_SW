// src/main/java/com/example/chat/config/WsAuthChannelInterceptor.java
package com.example.chat.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.Principal;
import java.util.List;

@Slf4j
@Configuration
public class WsAuthChannelInterceptor implements ChannelInterceptor {

    // 데모 비밀키 (실서비스는 교체!)
    private final Key key = Keys.hmacShaKeyFor("demo-secret-demo-secret-demo-secret-256".getBytes(StandardCharsets.UTF_8));

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(acc.getCommand())) {
            String auth = headerFirst(acc, "Authorization");
            String fallback = headerFirst(acc, "X-Auth-UserId");
            Long userId = null;

            if (auth != null && auth.startsWith("Bearer ")) {
                try {
                    String token = auth.substring(7);
                    Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                            .parseClaimsJws(token).getBody();
                    userId = Long.valueOf((String) claims.get("sub")); // 예: sub=memberId
                } catch (Exception e) {
                    log.warn("JWT invalid: {}", e.getMessage());
                }
            }
            if (userId == null && fallback != null) userId = Long.valueOf(fallback);
            if (userId == null) throw new IllegalStateException("Unauthorized WebSocket CONNECT");

            Long finalUserId = userId;
            Principal p = () -> String.valueOf(finalUserId);
            acc.setUser(p);
            log.info("[WS] CONNECT user={}", userId);
        }
        return message;
    }

    private String headerFirst(StompHeaderAccessor acc, String key) {
        List<String> vals = acc.getNativeHeader(key);
        return (vals != null && !vals.isEmpty()) ? vals.get(0) : null;
    }
}
