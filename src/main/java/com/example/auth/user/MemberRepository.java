package com.example.auth.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByProviderAndProviderUserId(Provider provider, String providerUserId);

    Optional<Member> findByNickname(String nickname);

    List<Member> findByNicknameContainingIgnoreCase(String nickname);
}
