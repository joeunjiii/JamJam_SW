import * as React from "react";
import { Image, SafeAreaView, Text, View, Platform,Pressable } from "react-native";
import { styles, colors } from "./style/Login.styles";
import SocialButton from "./SocialButton";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

export default function Login({ navigation }) {
  const BACKEND_URL = Constants.expoConfig?.extra?.apiUrl;

  // 웹 성공 URL 처리: /oauth/success?token_type=...&access_token=...
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

        AsyncStorage.setItem("jj.token_type", tokenType);
        AsyncStorage.setItem("jj.access_token", accessToken);
        AsyncStorage.setItem("jj.expires_at", String(expiresAt));

        // URL에서 민감정보 제거
        const cleanUrl = window.location.origin + "/";
        window.history.replaceState({}, "", cleanUrl);

        if (navigation && typeof navigation.replace === "function") {
          navigation.replace("ProfileScreen");
        } else {
          window.location.href = "/";
        }
      }
    } catch (e) {
      console.error("웹 성공 URL 처리 중 오류:", e);
    }
  }, [navigation]);

  const handleLogin = async (provider) => {
    if (!BACKEND_URL) {
      console.error("EXPO_PUBLIC_API_URL (app.config.js -> extra.apiUrl) 누락");
      return;
    }

    // 1) 웹(브라우저)
    if (Platform.OS === "web") {
      const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}?web=1`;
      window.location.href = authUrl;
      return;
    }

    // 2) 네이티브(Expo Go/앱): 딥링크 + 코드교환
    const redirectUri = Linking.createURL("oauth2/success"); // ex) jamjam://oauth2/success
    const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type !== "success" || !result.url) return;

    // 네이티브에서는 커스텀 스킴일 수 있어 URL() 대신 Linking.parse 사용이 안전
    const parsed = Linking.parse(result.url);
    const qp = (parsed && parsed.queryParams) || {};

    // (A) 네이티브에 토큰이 직접 온 경우(옵션)
    if (qp.token) {
      try {
        await AsyncStorage.setItem("jj.token_type", "Bearer");
        await AsyncStorage.setItem("jj.access_token", String(qp.token));
        await AsyncStorage.setItem(
          "jj.expires_at",
          String(Date.now() + 3600 * 1000)
        );
        navigation.replace("ProfileScreen");
        return;
      } catch (e) {
        console.error("토큰 저장 실패:", e);
      }
    }

    // (B) 코드가 온 경우 → 교환 API 호출(기본)
    if (qp.code) {
      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/mobile/exchange`,
          { code: qp.code }
        );
        if (data && data.access_token) {
          await AsyncStorage.setItem(
            "jj.token_type",
            data.token_type ? String(data.token_type) : "Bearer"
          );
          await AsyncStorage.setItem("jj.access_token", String(data.access_token));

          if (data.expires_in) {
            const expiresAt = Date.now() + Number(data.expires_in) * 1000;
            await AsyncStorage.setItem("jj.expires_at", String(expiresAt));
          }
          navigation.replace("ProfileScreen");
        } else {
          console.error("교환 응답에 access_token 없음:", data);
        }
      } catch (err) {
        const msg =
          (err && err.response && err.response.data) ||
          (err && err.message) ||
          String(err);
        console.error("토큰 교환 실패:", msg);
      }
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
        <View className="buttonGroup" style={styles.buttonGroup}>
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
          <Pressable onPress={() => navigation.replace("Main")}>
            <Text>테스트 버튼 메인으로 이동</Text>
          </Pressable>
          <Text style={styles.help}>로그인에 문제가 있으신가요?</Text>
        </View>

        <View style={{ height: 10 }} />
      </View>
    </SafeAreaView>
  );
}
