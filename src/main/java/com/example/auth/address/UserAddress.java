package com.example.auth.address;

import com.example.auth.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_addresses")
public class UserAddress {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String latitude;
    private String longitude;

    private String region1DepthName;
    private String region2DepthName;
    private String region3DepthName;

    private Instant createdAt = Instant.now();
}
