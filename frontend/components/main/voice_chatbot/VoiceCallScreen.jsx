import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";
import { fetchCaption, startTimer, stopTimer } from "./service/voiceService";
import { playTTS } from "./service/sttService";
import useRecorder from "./service/useRecorder";


export default function VoiceCallScreen() {
  const navigation = useNavigation();

  const [phase, setPhase] = useState("idle"); // 'listening' | 'speaking' | 'thinking'
  const [caption, setCaption] = useState("텍스트 공간");
  const [time, setTime] = useState("00:00");

  const [uri, setUri] = useState(null); // 🔹 저장된 파일 경로


  const {
    toggleRecording,
    isRecording,
    currentCategory,
  } = useRecorder((result) => {
    console.log("🎯 Whisper 결과:", result);
  });

  // AI 응답을 TTS로 재생 → 끝나면 자동으로 녹음 시작 TTS재생되면 
  const handleAIResponse = async (ttsUrl) => {
    await playTTS(
      ttsUrl,
      null, // 재생 시작시엔 아무것도 안 함
      () => {
        console.log("✅ AI 말 다 끝남 → 사용자 발화 녹음 시작");
        toggleRecording("AI 응답");
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
        <Text style={style.nameText}>잼잼이</Text>
        <View style={style.timePill}>
          <Text style={style.timeText}>{time}</Text>
        </View>
      </View>


      {/* 육아 Rive 애니메이션 */}



      {/* 하단 패널 */}
      <View style={style.bgCurve}>
        <View style={style.iconRow}>
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/mic.png")}
            label="말해요"
            onPress={() => toggleRecording("말해요")}
            active={isRecording && currentCategory === "말해요"}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/heart.png")}
            label="칭찬해요"
            onPress={() => toggleRecording("칭찬해요")}
            active={isRecording && currentCategory === "칭찬해요"}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/cat.png")}
            label="공감해요"
            onPress={() => toggleRecording("공감해요")}
            active={isRecording && currentCategory === "공감해요"}
          />
          <IconGhost
            source={require("../../../assets/main/voice_chatbot/angry.png")}
            label="교육해요"
            onPress={() => toggleRecording("교육해요")}
            active={isRecording && currentCategory === "교육해요"}
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

function IconGhost({ source, label, onPress, active }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Pressable
        onPress={onPress}
        style={[
          style.secBtn,
          active && { backgroundColor: "#FF675D" }, // 🔥 녹음 중 빨간 배경
        ]}
      >
        {active ? (
          // 🔴 녹음 중 → 흰색 정지 박스 표시
          <View
            style={{
              width: 28,
              height: 28,
              backgroundColor: "#fff",
            }}
          />
        ) : (
          // ⚪ 기본 → 기존 아이콘 이미지 표시
          <Image
            source={source}
            style={{ width: "70%", height: "70%", resizeMode: "contain" }}
          />
        )}
      </Pressable>
      {label && <Text style={style.iconLabel}>{label}</Text>}
    </View>
  );
}