// components/login/Login.jsx
import * as React from "react";
import { Image, SafeAreaView, Text, View, Platform, Alert } from "react-native";
import { styles, colors } from "./style/Login.styles";
import SocialButton from "./SocialButton";

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

// ====== 중요: Expo Go에서는 커스텀 스킴 대신 프록시 리다이렉트 사용 ======
WebBrowser.maybeCompleteAuthSession();

// Kakao OAuth endpoints
const discovery = {
    authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
    tokenEndpoint: "https://kauth.kakao.com/oauth/token",
};

// 환경 변수 가져오기
const KAKAO_REST_API_KEY = Constants.expoConfig?.extra?.kakaoRestApiKey;
const BACKEND_URL = Constants.expoConfig?.extra?.apiUrl;

export default function Login({ navigation }) {
    // (A) 웹 환경에서 OAuth2 성공 URL 처리
    React.useEffect(() => {
        if (Platform.OS !== "web") return;

        try {
            const search = window.location.search || "";
            if (!search) return;

            const params = new URLSearchParams(search);
            const tokenType = params.get("token_type");
            const accessToken = params.get("access_token");
            const expiresInStr = params.get("expires_in");

            if (tokenType === "Bearer" && accessToken) {
                const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : 3600;
                const expiresAt = Date.now() + expiresIn * 1000;

                (async () => {
                    try {
                        await AsyncStorage.setItem("jj.token_type", tokenType);
                        await AsyncStorage.setItem("jj.access_token", accessToken);
                        await AsyncStorage.setItem("jj.expires_at", String(expiresAt));
                    } catch (e) {
                        console.error("웹 토큰 저장 실패:", e);
                    }
                })();

                // URL 정리
                const cleanUrl = window.location.origin + "/";
                window.history.replaceState({}, "", cleanUrl);

                if (navigation?.replace) {
                    navigation.replace("ProfileScreen");
                } else {
                    window.location.href = "/";
                }
            }
        } catch (e) {
            console.error("웹 성공 URL 처리 중 오류:", e);
        }
    }, [navigation]);

    // (B) 모바일용 Kakao OAuth request 생성
    const KAKAO_REDIRECT_URI =
        Constants.expoConfig?.extra?.kakaoRedirectUri ??
        AuthSession.makeRedirectUri({ useProxy: true });
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: KAKAO_REST_API_KEY,
            redirectUri: KAKAO_REDIRECT_URI,   // ✅ .env 값과 동일
            responseType: "code",
        },
        discovery
    );



    // (C) 모바일 인증 응답 처리
    React.useEffect(() => {
        if (response?.type === "success" && response.params?.code) {
            const code = response.params.code;

            (async () => {
                try {
                    const resp = await axios.post(`${BACKEND_URL}/auth/kakao/exchange`, {
                        code,
                        redirectUri: KAKAO_REDIRECT_URI,
                    });

                    const data = resp.data || {};
                    const tokenType = data.token_type || "Bearer";
                    const accessToken = data.access_token || data.jwt;
                    const expiresIn = data.expires_in ? Number(data.expires_in) : 3600;

                    if (!accessToken) {
                        Alert.alert("로그인 실패", "토큰이 응답에 없습니다.");
                        return;
                    }

                    await AsyncStorage.setItem("jj.token_type", String(tokenType));
                    await AsyncStorage.setItem("jj.access_token", String(accessToken));
                    await AsyncStorage.setItem(
                        "jj.expires_at",
                        String(Date.now() + expiresIn * 1000)
                    );

                    navigation.replace("ProfileScreen");
                } catch (err) {
                    console.error(err);
                    Alert.alert("카카오 로그인 오류", err?.message ?? "알 수 없는 오류");
                }
            })();
        }
    }, [response]);

    // (D) 로그인 버튼 핸들러 (웹 + 모바일 지원)
    const handleLogin = async (provider) => {
        if (!BACKEND_URL) {
            Alert.alert("환경변수 누락", "EXPO_PUBLIC_API_URL이 설정되지 않았습니다.");
            return;
        }

        // 1) 웹 → 백엔드 Spring Security로 리다이렉트
        if (Platform.OS === "web") {
            const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}?web=1`;
            window.location.href = authUrl;
            return;
        }

        // 2) 모바일 → Kakao OAuth
        if (provider === "kakao") {
            if (!KAKAO_REST_API_KEY) {
                Alert.alert("환경변수 누락", "EXPO_PUBLIC_KAKAO_REST_API_KEY가 없습니다.");
                return;
            }

            if (!request) {
                Alert.alert("준비중", "로그인 요청 객체가 아직 준비되지 않았습니다.");
                return;
            }

            await promptAsync(); // expo-auth-session@6.x 방식
            return;
        }

        // 3) Google (옵션)
        if (provider === "google") {
            Alert.alert("안내", "모바일(Expo Go)용 Google 로그인은 별도 구현이 필요합니다.");
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
            <View style={styles.container}>
                <View style={{ flex: 1 }} />

                <View style={styles.centerBox}>
                    <Text style={[styles.tagline, { color: colors.brown }]}>
                        가볍게 잼잼, 함께하는 육아
                    </Text>
                    <Image
                        source={require("../../assets/Login/mainlogo.png")}
                        style={styles.illo}
                    />
                </View>

                <View style={{ flex: 1 }} />
                <View style={styles.buttonGroup}>
                    <SocialButton
                        variant="kakao"
                        text="카카오로 시작하기"
                        onPress={() => handleLogin("kakao")}
                    />
                    <View style={{ height: 12 }} />
                    <SocialButton
                        variant="google"
                        text="Google로 시작하기"
                        onPress={() => handleLogin("google")}
                    />
                    <View style={{ height: 130 }} />
                    <Text style={styles.help}>로그인에 문제가 있으신가요?</Text>
                </View>

                <View style={{ height: 10 }} />
            </View>
        </SafeAreaView>
    );
}