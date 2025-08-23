import * as React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { styles, colors } from "./style/Login.styles";
import SocialButton from "./SocialButton";
import { API_URL } from "@env";


import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function Login({ navigation }) {

  const BACKEND_URL = API_URL;

  const handleLogin = async (provider) => {
    // RN redirect URI 생성 (딥링크)
    const redirectUri = Linking.createURL("oauth2/success");

    // 백엔드 OAuth2 로그인 URL
    const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}`;

    // 카카오/구글 로그인 시작
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url) {
      // 백엔드가 redirect할 때 토큰 전달 → token 파라미터 추출
      const tokenParam = result.url.split("token=")[1];
      if (tokenParam) {
        await AsyncStorage.setItem("jwt", tokenParam);
        console.log("저장된 토큰:", tokenParam);

        // 로그인 성공 후 메인 화면으로 이동
        navigation.replace("ProfileScreen");
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
            // onPress={() => navigation.navigate("ProfileScreen")} //임시로 main페이지로 보냄
            onPress={() => handleLogin("kakao")}
          />
          <View style={{ height: 12 }} />
          <SocialButton
            variant="google"
            text="Google로 시작하기"
            onPress={() => navigation.navigate("ProfileScreen")} //임시로 main페이지로 보냄
            // onPress={() => handleLogin("google")}
          />
          <View style={{ height: 130 }} />
          <Text style={styles.help}>로그인에 문제가 있으신가요?</Text>
        </View>

        <View style={{ height: 10 }} />
      </View>
    </SafeAreaView>
  );
}
