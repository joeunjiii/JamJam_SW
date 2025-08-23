package com.example.auth.oauth;

import com.example.auth.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mobile")
@RequiredArgsConstructor
public class MobileExchangeController {

    private final OneTimeCodeService codeService;
    private final JwtUtil jwtUtil;

    @PostMapping("/exchange")
    public ResponseEntity<Map<String, Object>> exchange(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        OneTimeCodeService.CodeEntry entry = codeService.consume(code);
        if (entry == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "invalid_or_expired_code"));
        }

        String access = jwtUtil.createAccessToken(entry.getUserId(), JwtUtil.Audience.MOBILE, entry.getExtra());

        return ResponseEntity.ok(Map.of(
                "token_type", "Bearer",
                "access_token", access,
                "expires_in", 3600
        ));
    }

}

