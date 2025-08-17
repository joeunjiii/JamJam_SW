package com.example.auth.address;

import com.example.auth.user.User;
import com.example.auth.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AddressController {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final KakaoLocalClient kakaoLocalClient;

    // Path: /users/:user_id/address
    @PostMapping("/users/{user_id}/address")
    public ResponseEntity<?> saveAddress(
            @PathVariable("user_id") String userId,
            @RequestBody UserAddressRequest body,
            Authentication auth) {

        // JWT 필터가 Authentication에 userId(subject)를 세팅함 (SecurityConfig/JwtAuthenticationFilter)
        if (auth == null || !userId.equals(auth.getName())) {
            return ResponseEntity.status(403).body("forbidden");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        var region = kakaoLocalClient.reverseGeocode(body.latitude(), body.longitude());

        UserAddress addr = new UserAddress();
        addr.setUser(user);
        addr.setLatitude(body.latitude());
        addr.setLongitude(body.longitude());
        addr.setRegion1DepthName(region.region1DepthName());
        addr.setRegion2DepthName(region.region2DepthName());
        addr.setRegion3DepthName(region.region3DepthName());
        addressRepository.save(addr);

        return ResponseEntity.ok(new UserAddressResponse(
                region.region1DepthName(), region.region2DepthName(), region.region3DepthName()
        ));
    }

    public record UserAddressRequest(
            @NotBlank String latitude,
            @NotBlank String longitude
    ) {}

    public record UserAddressResponse(
            String region1DepthName,
            String region2DepthName,
            String region3DepthName
    ) {}
}
