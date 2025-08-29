package com.example.chat.controller;

import com.example.chat.dto.DmMessageDto;
import com.example.chat.dto.DmThreadDto;
import com.example.chat.dto.Payloads.MessageResponse;
import com.example.chat.dto.Payloads.ThreadResponse;
import com.example.chat.service.DmService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dm")
@RequiredArgsConstructor
public class DmApiController {

    private final DmService dmService;

    private Long currentUserId(HttpServletRequest req) {
        // 데모: X-Auth-UserId 로 사용자 식별 (실서비스는 SecurityContext 사용)
        String h = req.getHeader("X-Auth-UserId");
        if (h == null) throw new RuntimeException("No auth header");
        return Long.valueOf(h);
    }

    @PostMapping("/thread/{otherUserId}")
    public DmThreadDto getOrCreateThread(@PathVariable Long otherUserId, HttpServletRequest req) {
        return dmService.findOrCreateThread(currentUserId(req), otherUserId);
    }

    @GetMapping("/thread/{threadId}/recent")
    public List<DmMessageDto> recent(@PathVariable Long threadId,
                                     @RequestParam(defaultValue = "50") int size) {
        return dmService.getRecentMessages(threadId, Math.min(size, 100));
    }
}
