package com.example.auth.config;

import com.example.auth.config.JwtAuthenticationFilter;
import com.example.auth.oauth.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // ✅ 경고 없는 RequestMatcher: 서블릿 경로가 /api/ 로 시작하는지 여부
        RequestMatcher apiMatcher = request -> {
            String path = request.getServletPath(); // contextPath 제외한 상대 경로
            return path != null && path.startsWith("/api/");
        };

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(reg -> reg
                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // STOMP 엔드포인트(필요 시만 개방)
                        .requestMatchers("/ws/**", "/ws-native/**").permitAll()

                        // 공개 엔드포인트
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/policy/**").permitAll()
                        .requestMatchers("/api/posts/**").permitAll()

                        // 🔓 검색을 공개로 운용하려면 유지(인증 필요로 바꾸려면 이 줄 삭제)
                        .requestMatchers(HttpMethod.GET, "/api/dm/search").permitAll()

                        // 나머지 /api/** 는 인증 강제
                        .requestMatchers("/api/**").authenticated()

                        // 그 외는 프로젝트 정책에 맞게
                        .anyRequest().permitAll()
                )

                // ✅ /api/** 비인증 요청은 401 JSON (302 리다이렉트 방지)
                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                apiMatcher
                        )
                        // (선택) 전역 엔트리포인트도 JSON으로 맞추고 싶으면 유지, 아니면 제거
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            res.getWriter().write(
                                    "{\"status\":401,\"code\":\"UNAUTHORIZED\",\"message\":\"Auth required\"}"
                            );
                        })
                )

                // REST: 폼/베이직 비활성화
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // OAuth2 로그인은 웹 플로우에만 사용
                .oauth2Login(oauth -> oauth.successHandler(oAuth2SuccessHandler))

                // JWT 인증 필터
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
