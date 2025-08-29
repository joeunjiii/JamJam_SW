package com.example.chat.Repository;

import com.example.auth.user.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    /**
     * 닉네임으로 사용자 검색
     */
    Optional<Member> findByNickname(String nickname);

    /**
     * 닉네임 부분 검색
     */
    @Query("SELECT m FROM Member m WHERE LOWER(m.nickname) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Member> searchByNickname(@Param("keyword") String keyword);

    /**
     * 소셜 로그인 정보로 조회
     */
    Optional<Member> findByProviderAndProviderUserId(Integer provider, String providerUserId);

    /**
     * 이메일로 조회
     */
    Optional<Member> findByEmail(String email);

    /**
     * 여러 ID로 사용자 조회
     */
    @Query("SELECT m FROM Member m WHERE m.memberId IN :ids")
    List<Member> findByIds(@Param("ids") List<Long> ids);
}
