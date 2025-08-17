package com.example.auth.user;

import com.example.auth.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @GetMapping("/auth/profile")
    public ResponseEntity<?> profile(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = auth.substring(7);
        Claims claims = jwtUtil.parse(token).getBody();
        String id = claims.get("id", String.class);

        return userRepository.findById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new UserProfileResponse(
                        u.getId(), u.getUsername(), u.getNickname()
                )))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    public record UserProfileResponse(String id, String username, String nickname) {}
}
