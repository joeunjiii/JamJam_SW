package com.example.auth.address;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class KakaoLocalClient {

    @Value("${kakao.rest-api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public RegionNames reverseGeocode(String latitude, String longitude) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/geo/coord2regioncode.json")
                .queryParam("x", longitude) // x = 경도
                .queryParam("y", latitude)  // y = 위도
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<KakaoRegionResponse> resp =
                restTemplate.exchange(url, HttpMethod.GET, entity, KakaoRegionResponse.class);

        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null
                && resp.getBody().documents != null && resp.getBody().documents.length > 0) {
            var doc = resp.getBody().documents[0];
            return new RegionNames(doc.region_1depth_name, doc.region_2depth_name, doc.region_3depth_name);
        }
        return new RegionNames("", "", "");
    }

    @Data
    static class KakaoRegionResponse {
        private Document[] documents;
    }

    @Data
    static class Document {
        private String region_type;
        private String address_name;
        private String region_1depth_name;
        private String region_2depth_name;
        private String region_3depth_name;
        private String region_4depth_name;
        private double x;
        private double y;
    }

    public record RegionNames(String region1DepthName, String region2DepthName, String region3DepthName) {}
}
