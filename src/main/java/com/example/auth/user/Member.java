// com.example.auth.user.Member.java
package com.example.auth.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "member",
        uniqueConstraints = @UniqueConstraint(name="uq_provider_user", columnNames={"provider","provider_user_id"}),
        indexes = { @Index(name="ix_member_joined_at", columnList="joined_at") }
)
@Getter @Setter @NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Convert(converter = ProviderConverter.class)
    @Column(nullable = false)
    private Provider provider;               // 1=KAKAO, 2=GOOGLE

    @Column(name = "provider_user_id", length = 191, nullable = false)
    private String providerUserId;          // 소셜 고유 ID

    @Column(length = 50)
    private String nickname;

    @Column(length = 191)
    private String email;

    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}
