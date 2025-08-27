package com.example.auth.config;

import com.example.auth.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException; // ← 이거!
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // ① 'null'/'undefined'/공백 토큰 방지
            if (token == null || token.isBlank()
                    || "null".equalsIgnoreCase(token)
                    || "undefined".equalsIgnoreCase(token)) {
                log.warn("Invalid bearer token placeholder: {}", token);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            try {
                // ② aud 검증 포함: WEB → 실패 시 MOBILE
                Claims claims;
                try {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.WEB);
                } catch (JwtException e) {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.MOBILE);
                }

                String userId = claims.getSubject();
                String nickname = claims.get("nickname", String.class);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                new UserPrincipal(userId, nickname),
                                null,
                                List.of()
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JwtException e) {
                log.warn("JWT verification failed: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
