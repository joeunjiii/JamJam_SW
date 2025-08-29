import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";
import { fetchCaption, startTimer, stopTimer } from "./service/voiceService";
import useRecorder from "./service/useRecorder";


export default function VoiceCallScreen() {
  const navigation = useNavigation();

  const [phase, setPhase] = useState("idle"); // 'listening' | 'speaking' | 'thinking'
  const [caption, setCaption] = useState("텍스트 공간");
  const [time, setTime] = useState("00:00");

  const [uri, setUri] = useState(null); // 🔹 저장된 파일 경로


  const { startRecording, stopRecording } = useRecorder((text) => {
    if (text) {
      console.log("📝 Whisper 변환 결과:", text);
      setCaption(`👤 ${text}`); // 프론트에서만 확인
      //  TODO: 나중에 백엔드 전달
      // sttService에 sentTextToBackend함수를 통해서 백엔드로 보냄
      // await sendTextToBackend(text);
    }
  });

  // AI 응답을 TTS로 재생 → 끝나면 자동으로 녹음 시작 TTS재생되면
  const handleAIResponse = async (ttsUrl) => {
    await playTTS(
      ttsUrl,
      null, // 재생 시작시엔 아무것도 안 함
      () => {
        console.log("✅ AI 말 다 끝남 → 사용자 발화 녹음 시작");
        startRecording();
      }
    );
  };

  // 타이머 시작/정지
  useEffect(() => {
    startTimer(setTime);
    return () => stopTimer();
  }, []);

  useEffect(() => {
    fetchCaption(phase).then(setCaption);
  }, [phase]);

  return (
    <SafeAreaView style={style.safe}>

      {/* Top */}
      <View style={style.topWrap}>
        <Text style={style.nameText}>잼잼이(육아 AI)</Text>

        <View style={style.timePill}>
          <Text style={style.timeText}>{time}</Text>
        </View>
      </View>


      {/* 육아 AI 사진 */}

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <Pressable
          onPress={startRecording}
          style={{ padding: 12, backgroundColor: "green", borderRadius: 8, marginRight: 10 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>녹음 시작</Text>
        </Pressable>
        <Pressable
          onPress={stopRecording}
          style={{ padding: 12, backgroundColor: "red", borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>녹음 종료</Text>
        </Pressable>
      </View>




      {/* 하단 패널 */}
      <View style={style.bgCurve}>
        <View style={style.iconRow}>
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/mic.png")}
            label="말해요"
            onPress={() => { }}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/heart.png")}
            label="칭찬해요"
            onPress={() => { }}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/cat.png")}
            label="공감해요"
            onPress={() => { }}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/angry.png")}
            label="교육해요"
            onPress={() => { }}
          />

        </View>

        <Pressable
          onPress={() => navigation.replace("Main")}
          onPressOut={() => { }}
          style={({ pressed }) => [
            style.exiticon,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
          ]}
        >
          <Ionicons name="call" size={28} color="#FFF" />
        </Pressable>
      </View>


    </SafeAreaView>
  );
}

function IconGhost({ source, label, onPress }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          style.secBtn,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.6 },
        ]}
      >
        <Image
          source={source}
          style={{ width: "70%", height: "70%", resizeMode: "contain" }}
        />
      </Pressable>
      {label && <Text style={style.iconLabel}>{label}</Text>}
    </View>
  );
}


