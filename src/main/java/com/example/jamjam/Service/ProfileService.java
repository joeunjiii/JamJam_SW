package com.example.jamjam.Service;

import com.example.jamjam.DTO.ProfileRequestDTO;
import com.example.jamjam.DTO.ProfileResponseDTO;
import com.example.jamjam.Entity.Child;
import com.example.jamjam.Entity.UserProfile;
import com.example.jamjam.Exception.DuplicateNicknameException;
import com.example.jamjam.Exception.ProfileNotFoundException;
import com.example.jamjam.Repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProfileService {

    private final UserProfileRepository userProfileRepository;

    /**
     * 프로필 조회 (사용자 ID 기반)
     */
    public ProfileResponseDTO getProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserIdWithChildren(userId)
                .orElseThrow(() -> new ProfileNotFoundException("프로필을 찾을 수 없습니다."));

        return ProfileResponseDTO.fromEntity(profile);
    }

    /**
     * 프로필 생성
     */
    @Transactional
    public ProfileResponseDTO createProfile(Long userId, ProfileRequestDTO requestDTO) {
        // 이미 프로필이 존재하는지 확인
        if (userProfileRepository.existsByUserId(userId)) {
            throw new IllegalStateException("이미 프로필이 존재합니다. 수정 기능을 사용해주세요.");
        }

        // 닉네임 중복 확인
        if (userProfileRepository.existsByNickname(requestDTO.getNickname())) {
            throw new DuplicateNicknameException("이미 사용 중인 닉네임입니다.");
        }

        // 프로필 생성
        UserProfile profile = buildProfileFromRequest(userId, requestDTO);

        // 자녀 정보 추가
        addChildrenToProfile(profile, requestDTO);

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("프로필이 생성되었습니다. userId: {}, profileId: {}", userId, savedProfile.getId());

        return ProfileResponseDTO.fromEntity(savedProfile);
    }

    /**
     * 프로필 수정
     */
    @Transactional
    public ProfileResponseDTO updateProfile(Long userId, ProfileRequestDTO requestDTO) {
        UserProfile existingProfile = userProfileRepository.findByUserIdWithChildren(userId)
                .orElseThrow(() -> new ProfileNotFoundException("수정할 프로필을 찾을 수 없습니다."));

        // 닉네임 중복 확인 (현재 사용자 제외)
        if (userProfileRepository.existsByNicknameAndUserIdNot(requestDTO.getNickname(), userId)) {
            throw new DuplicateNicknameException("이미 사용 중인 닉네임입니다.");
        }

        // 프로필 정보 업데이트
        updateProfileFromRequest(existingProfile, requestDTO);

        // 기존 자녀 정보 삭제 후 새로운 자녀 정보 추가
        existingProfile.getChildren().clear();
        addChildrenToProfile(existingProfile, requestDTO);

        UserProfile updatedProfile = userProfileRepository.save(existingProfile);
        log.info("프로필이 수정되었습니다. userId: {}, profileId: {}", userId, updatedProfile.getId());

        return ProfileResponseDTO.fromEntity(updatedProfile);
    }

    /**
     * 프로필 삭제
     */
    @Transactional
    public void deleteProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserIdWithChildren(userId)
                .orElseThrow(() -> new ProfileNotFoundException("삭제할 프로필을 찾을 수 없습니다."));

        userProfileRepository.delete(profile);
        log.info("프로필이 삭제되었습니다. userId: {}, profileId: {}", userId, profile.getId());
    }

    /**
     * 프로필 존재 여부 확인
     */
    public boolean hasProfile(Long userId) {
        return userProfileRepository.existsByUserId(userId);
    }

    // Private Helper Methods

    private UserProfile buildProfileFromRequest(Long userId, ProfileRequestDTO requestDTO) {
        return UserProfile.builder()
                .userId(userId)
                .nickname(requestDTO.getNickname())
                .gender(UserProfile.Gender.valueOf(requestDTO.getGender()))
                .parentingStatus(convertToParentingStatus(requestDTO.getStatus()))
                .dueDate(requestDTO.getDueDate())
                .profileImageUrl(requestDTO.getProfileImageUrl())
                .build();
    }

    private void updateProfileFromRequest(UserProfile profile, ProfileRequestDTO requestDTO) {
        profile.setNickname(requestDTO.getNickname());
        profile.setGender(UserProfile.Gender.valueOf(requestDTO.getGender()));
        profile.setParentingStatus(convertToParentingStatus(requestDTO.getStatus()));
        profile.setDueDate(requestDTO.getDueDate());

        if (StringUtils.hasText(requestDTO.getProfileImageUrl())) {
            profile.setProfileImageUrl(requestDTO.getProfileImageUrl());
        }
    }

    private void addChildrenToProfile(UserProfile profile, ProfileRequestDTO requestDTO) {
        if (requestDTO.getChildren() != null && !requestDTO.getChildren().isEmpty()) {
            requestDTO.getChildren().forEach(childDTO -> {
                Child child = Child.builder()
                        .name(childDTO.getName())
                        .birthDate(childDTO.getBirthDate())
                        .gender(Child.Gender.valueOf(childDTO.getGender()))
                        .build();
                profile.addChild(child);
            });
        }
    }

    private UserProfile.ParentingStatus convertToParentingStatus(String status) {
        return switch (status) {
            case "출산예정" -> UserProfile.ParentingStatus.출산예정;
            case "육아 중" -> UserProfile.ParentingStatus.육아중;
            case "해당사항 없음" -> UserProfile.ParentingStatus.해당사항없음;
            case "둘다" -> UserProfile.ParentingStatus.둘다;
            default -> throw new IllegalArgumentException("잘못된 육아 상태입니다: " + status);
        };
    }
}
