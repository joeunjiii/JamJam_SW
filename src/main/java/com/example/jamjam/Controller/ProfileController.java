package com.example.jamjam.Controller;

import com.example.jamjam.DTO.ProfileRequestDTO;
import com.example.jamjam.DTO.ProfileResponseDTO;
import com.example.jamjam.Service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // React 개발환경을 위한 CORS 설정
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    /**
     * 프로필 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponseDTO> getProfile(@PathVariable Long userId) {
        try {
            ProfileResponseDTO profile = profileService.getProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("프로필 조회 실패. userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 프로필 생성
     */
    @PostMapping("/{userId}")
    public ResponseEntity<ProfileResponseDTO> createProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileRequestDTO requestDTO) {
        try {
            ProfileResponseDTO profile = profileService.createProfile(userId, requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(profile);
        } catch (IllegalStateException e) {
            log.warn("프로필 생성 실패 - 이미 존재: userId: {}", userId);
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("프로필 생성 실패. userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 프로필 수정
     */
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponseDTO> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileRequestDTO requestDTO) {
        try {
            ProfileResponseDTO profile = profileService.updateProfile(userId, requestDTO);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("프로필 수정 실패. userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 프로필 저장 또는 수정 (통합 API)
     */
    @PostMapping("/{userId}/save")
    public ResponseEntity<ProfileResponseDTO> saveProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileRequestDTO requestDTO) {
        try {
            ProfileResponseDTO profile;
            if (profileService.hasProfile(userId)) {
                // 기존 프로필 수정
                profile = profileService.updateProfile(userId, requestDTO);
                log.info("프로필 수정 완료. userId: {}", userId);
            } else {
                // 새 프로필 생성
                profile = profileService.createProfile(userId, requestDTO);
                log.info("프로필 생성 완료. userId: {}", userId);
            }
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("프로필 저장 실패. userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    /**
     * 프로필 삭제
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long userId) {
        try {
            profileService.deleteProfile(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("프로필 삭제 실패. userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 프로필 존재 여부 확인
     */
    @GetMapping("/{userId}/exists")
    public ResponseEntity<Boolean> hasProfile(@PathVariable Long userId) {
        boolean exists = profileService.hasProfile(userId);
        return ResponseEntity.ok(exists);
    }

}
