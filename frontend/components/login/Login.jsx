import * as React from "react";
import { Image, SafeAreaView, Text, View, Platform } from "react-native";
import { styles, colors } from "./style/Login.styles";
import SocialButton from "./SocialButton";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

export default function Login({ navigation }) {
  const BACKEND_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleLogin = async (provider) => {
    if (!BACKEND_URL) {
      console.error("EXPO_PUBLIC_API_URL (app.config.js -> extra.apiUrl) 누락");
      return;
    }

    // 1) 웹(브라우저)에서는 그냥 백엔드로 바로 이동 → BE가 /oauth2/success?token=... 으로 돌려줌
    if (Platform.OS === "web") {
      const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}?web=1`;
      window.location.href = authUrl;
      return;
    }

    // 2) 네이티브(Expo Go/앱): 딥링크 + 코드교환
    const redirectUri = Linking.createURL("oauth2/success");
    const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== "success" || !result.url) return;

    const url = new URL(result.url);

    // (A) 백엔드가 토큰을 바로 리다이렉트로 준 경우
    const token = url.searchParams.get("token");
    if (token) {
      await AsyncStorage.setItem("jwt", token);
      navigation.replace("ProfileScreen");
      return;
    }

    // (B) 딥링크로 코드가 온 경우 → 교환 API 호출
    const code = url.searchParams.get("code");
    if (code) {
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/mobile/exchange`, { code });
        if (data?.access_token) {
          await AsyncStorage.setItem("jwt", data.access_token);
          navigation.replace("ProfileScreen");
        } else {
          console.error("교환 응답에 access_token 없음:", data);
        }
      } catch (err) {
        console.error("토큰 교환 실패:", err?.response?.data || err?.message);
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
