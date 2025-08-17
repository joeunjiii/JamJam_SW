package com.example.auth.oauth;

import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    // 기본 동작 사용 (필요 시 provider 별 attribute 변환을 여기서 커스텀)
}
