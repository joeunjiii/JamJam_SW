import 'dotenv/config';

export default {
  expo: {
    name: "JamJam",
    slug: "JamJam",
    scheme: "JamJam",
    "plugins": [
      "expo-audio"
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      kakaoJavascriptKey: process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY,
      kakaoRestApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
    },
    android: {
      permissions: ["ACCESS_FINE_LOCATION"],
    },
    ios: {
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "현재 위치를 지도에서 사용합니다.",
      },
    },
    
  },
};
