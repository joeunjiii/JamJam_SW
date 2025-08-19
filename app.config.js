import 'dotenv/config';

export default {
  expo: {
    name: "JamJamApp",
    slug: "jamjam-app",
    version: "1.0.0",
    orientation: "portrait",
    sdkVersion: "53.0.0", // 프로젝트 SDK 버전에 맞게!
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
        },
      },
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
    },
  },
};
