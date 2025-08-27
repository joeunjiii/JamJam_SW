import React, { useEffect, useRef } from "react";
import { Audio } from 'expo-audio';
import { View, Text, ImageBackground, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CallIncomingScreen({ navigation }) {
  const soundRef = useRef(null);

  useEffect(() => {
    let sound;
    async function playRingtone() {
      try {
        // 오디오 세션 설정
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // 사운드 로드 + 재생
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          require("../../../assets/main/voicecallscreen/iphone_alert.mp3"),
          { isLooping: true }
        );
        sound = loadedSound;
        soundRef.current = loadedSound;
        await loadedSound.playAsync();
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }

    playRingtone();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/main/voice_chatbot/cat.png")} // 배경 (아이 프로필 사진도 가능)
      style={styles.bg}
      blurRadius={8}
    >
      <View style={styles.overlay}>
        <Text style={styles.subText}>자녀 AI와 통화</Text>
        <Text style={styles.mainText}>수달이</Text>

        {/* 아바타 */}
        <View style={styles.avatarWrap}>
          <Ionicons name="person-circle" size={120} color="#fff" />
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonRow}>
          {/* 거절 버튼 */}
          <Pressable
            style={[styles.circleBtn, { backgroundColor: "#FF3B30" }]}
            onPress={async () => {
              if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
              }
              navigation.goBack();
            }}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </Pressable>
          {/* 수락 버튼 */}
          <Pressable
            style={[styles.circleBtn, { backgroundColor: "#34C759" }]}
            onPress={async () => {
              if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
              }
              navigation.navigate("VoiceCallScreen");
            }}
          >
            <Ionicons name="call" size={32} color="#fff" />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subText: {
    fontSize: 18,
    color: "#eee",
    marginBottom: 6,
  },
  mainText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  avatarWrap: {
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 80,
    marginTop: 60,
  },
  circleBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
