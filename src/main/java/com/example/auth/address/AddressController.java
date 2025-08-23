package com.example.auth.address;

import com.example.auth.user.Member;;
import com.example.auth.user.MemberRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AddressController {

    private final MemberRepository memberRepository;
    private final UserAddressRepository addressRepository;
    private final KakaoLocalClient kakaoLocalClient;

    // Path: /users/:user_id/address
    @PostMapping("/users/{user_id}/address")
    public ResponseEntity<?> saveAddress(
            @PathVariable("user_id") Long pathMemberId,
            @RequestBody UserAddressRequest body,
            Authentication auth) {

        if (auth == null) return ResponseEntity.status(401).build();
        Long authedMemberId = Long.valueOf(auth.getName());
        if (!pathMemberId.equals(authedMemberId)) return ResponseEntity.status(403).body("forbidden");

        Member member = memberRepository.findById(pathMemberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        var region = kakaoLocalClient.reverseGeocode(body.latitude(), body.longitude());

        UserAddress addr = new UserAddress();
        addr.setMember(member);
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