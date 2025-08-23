package com.example.auth.config;

import com.example.auth.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // ✅ ACCESS 토큰 검증
                Claims claims;
                try {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.WEB);
                } catch (JwtException e) {
                    claims = jwtUtil.verify(token, JwtUtil.TokenType.ACCESS, JwtUtil.Audience.MOBILE);
                }

                String userId = claims.getSubject();
                String nickname = claims.get("nickname", String.class);

                // Security 인증 객체 생성 (추후 CustomPrincipal로 교체 가능)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                new UserPrincipal(userId, nickname), // principal
                                null,
                                List.of() // 권한 비워둠
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

}
