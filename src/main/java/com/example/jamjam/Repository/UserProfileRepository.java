package com.example.jamjam.Repository;


import com.example.jamjam.Entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    /**
     * 사용자 ID로 프로필 조회 (자녀 정보 포함)
     */
    @Query("SELECT p FROM UserProfile p LEFT JOIN FETCH p.children WHERE p.userId = :userId")
    Optional<UserProfile> findByUserIdWithChildren(@Param("userId") Long userId);

    /**
     * 사용자 ID로 프로필 존재 여부 확인
     */
    boolean existsByUserId(Long userId);

    /**
     * 닉네임 중복 확인 (현재 사용자 제외)
     */
    @Query("SELECT COUNT(p) > 0 FROM UserProfile p WHERE p.nickname = :nickname AND p.userId != :userId")
    boolean existsByNicknameAndUserIdNot(@Param("nickname") String nickname, @Param("userId") Long userId);

    /**
     * 닉네임 중복 확인 (새로운 프로필 생성 시)
     */
    boolean existsByNickname(String nickname);
}
