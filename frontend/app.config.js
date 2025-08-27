import 'dotenv/config';

export default {
  expo: {
    name: "JamJam",
    slug: "JamJam",
    scheme: "jamjam",
    "plugins": [
      "expo-audio"
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      kakaoJavascriptKey: process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY,
      kakaoRestApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
      kakaoRedirectUri: process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI,
      eas: {
        projectId: "db6290d2-5753-4cbd-8828-69951c52466d"   // ⬅️ 이거 추가
      }
    },
    android: {
      package: "com.yourcompany.jamjam",
      permissions: ["ACCESS_FINE_LOCATION"],
    },
    ios: {
      bundleIdentifier: "com.yourcompany.jamjam",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "현재 위치를 지도에서 사용합니다.",
      },
    },
    
  },
};
