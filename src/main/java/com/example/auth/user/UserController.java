package com.example.auth.user;

import com.example.auth.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @GetMapping("/auth/profile")
    public ResponseEntity<?> profile(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).build();

        Claims claims;
        try {
            claims = jwtUtil.verify(auth.substring(7), JwtUtil.TokenType.ACCESS, JwtUtil.Audience.WEB);
        } catch (JwtException e) {
            claims = jwtUtil.verify(auth.substring(7), JwtUtil.TokenType.ACCESS, JwtUtil.Audience.MOBILE);
        }
        Long memberId = Long.valueOf(String.valueOf(claims.get("id")));

        return memberRepository.findById(memberId)
                .<ResponseEntity<?>>map(m -> ResponseEntity.ok(new UserProfileResponse(
                        String.valueOf(m.getId()),              // id: string
                        // username 스펙이 있지만 테이블엔 별도 필드가 없으므로 nickname/email로 대체 규칙 정의
                        (m.getEmail() != null ? m.getEmail().split("@")[0] : "user" + m.getId()),
                        m.getNickname()
                )))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    public record UserProfileResponse(String id, String username, String nickname) {}
}
