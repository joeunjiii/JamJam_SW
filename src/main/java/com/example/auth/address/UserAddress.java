package com.example.auth.address;

import com.example.auth.user.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_addresses")
@Getter @Setter @NoArgsConstructor
public class UserAddress {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")     // FK → member.member_id
    private Member member;

    private String latitude;
    private String longitude;

    private String region1DepthName;
    private String region2DepthName;
    private String region3DepthName;

    private Instant createdAt = Instant.now();
}
