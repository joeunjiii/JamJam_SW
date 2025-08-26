// src/main/java/com/example/auth/config/SecurityConfig.java
package com.example.auth.config;

import com.example.auth.oauth.CustomOAuth2UserService;
import com.example.auth.oauth.OAuth2SuccessHandler;
import com.example.auth.config.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 세션 상태 없이 동작
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                // 인가 규칙
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/health", "/error").permitAll()
                        // OAuth2 엔드포인트(스프링 시큐리티 기본 엔드포인트들)
                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/oauth2/authorization/**",
                                "/login/**"
                        ).permitAll()
                        // 모바일 앱에서 1회용 코드 교환 API
                        .requestMatchers(HttpMethod.POST, "/api/mobile/exchange").permitAll()
                        // 그 외는 인증 필요
                        .anyRequest().authenticated()
                )

                // OAuth2 로그인 설정: 커스텀 유저 서비스 + 성공 핸들러
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )

                // JWT 필터 등록 (UsernamePasswordAuthenticationFilter 이전)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
