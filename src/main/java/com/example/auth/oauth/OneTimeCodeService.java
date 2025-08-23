package com.example.auth.oauth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OneTimeCodeService {
    private final Map<String, CodeEntry> store = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String issueForUser(String userId, Map<String, Object> extra, Duration ttl) {
        byte[] buf = new byte[16];
        random.nextBytes(buf);
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
        store.put(code, new CodeEntry(userId, extra, System.currentTimeMillis() + ttl.toMillis()));
        return code;
    }

    public CodeEntry consume(String code) {
        CodeEntry entry = store.remove(code); // 1회성
        if (entry == null || entry.expiresAt < System.currentTimeMillis()) return null;
        return entry;
    }

    @Getter @AllArgsConstructor
    public static class CodeEntry {
        private final String userId;
        private final Map<String, Object> extra; // 닉네임 등
        private final long expiresAt;
    }
}
