import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Text, Image, Pressable, SafeAreaView, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";
import { fetchCaption, startTimer, stopTimer } from "./service/voiceService";
import { playTTS, sendTextToBackend } from "./service/sttService";
import useRecorder from "./service/useRecorder";
import { fetchTTS, playAudio } from "./service/ttsService";
import Rive from "rive-react-native";
import { Asset } from "expo-asset";
import JamJamRive from "./JamJamRive";


export default function VoiceCallScreen() {

  const navigation = useNavigation();
  const riveRef = useRef(null);

  const play = () => {
    riveRef.current?.play("Idle");
  };

  const pause = () => {
    riveRef.current?.pause();
    C
  };
  const [emotionState, setEmotionState] = useState('neutral');

  const [phase, setPhase] = useState("idle"); // 'listening' | 'speaking' | 'thinking'
  const [caption, setCaption] = useState("텍스트 공간");
  const [time, setTime] = useState("00:00");

  const [src, setSrc] = useState(null);
  const [uri, setUri] = useState(null); // 🔹 저장된 파일 경로

  useEffect(() => {
    if (riveRef.current) {
      const emotions = ['happy', 'sad', 'angry', 'embarrassed', 'anxious', 'neutral'];

      emotions.forEach((emotion) => {
        // 감정에 맞는 트리거만 true로 설정하고, 나머지는 false로 설정
        riveRef.current.stateMachineInputs?.["JamJam"]?.[emotion]?.setBoolean(emotionState === emotion);
      });

      console.log("🎭 트리거 상태 업데이트:", emotionState); // 콘솔로 상태 확인
    }
  }, [emotionState]);



  useEffect(() => {
    async function prepareAudio() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false, // 🔊 이어피스 대신 스피커
      });
    }
    prepareAudio();
  }, []);
  // 토글함수로 녹음 시작, 녹음종료 녹음종료되면서 fastapi로 보내고 다시 음답받아옴
  const { toggleRecording, isRecording } = useRecorder(async (result) => {
    console.log("🎙️ 녹음 완료:", result.text);

    setPhase("thinking"); // 🔄 AI 응답 기다리는 중

    if (result.text) {
      try {
        const aiResponse = await sendTextToBackend(result.text);

        if (aiResponse) {
          console.log("🤖 AI 응답:", aiResponse);

          setPhase("speaking");

          // 🔊 슈퍼톤 TTS 호출
          const audioUrl = await fetchTTS(aiResponse);
          if (audioUrl) {
            await playAudio(audioUrl);
          }
        } else {
          setPhase("idle");
        }
      } catch (err) {
        console.error("AI 응답 처리 에러:", err);
        setPhase("idle");
      }
    } else {
      setCaption("음성을 인식하지 못했어요 🎤");
      setPhase("idle");
    }
  });



  // 타이머 시작/정지
  useEffect(() => {
    startTimer(setTime);
    return () => stopTimer();
  }, []);

  useEffect(() => {
    fetchCaption(phase).then(setCaption);
  }, [phase]);

  // 마이크 버튼 클릭 핸들러
  const handleMicPress = () => {
    toggleRecording();
  };

  return (
    <SafeAreaView style={style.safe}>

      {/* Top */}
      <View style={style.topWrap}>
        <Text style={style.nameText}>잼잼이</Text>
        <View style={style.timePill}>
          <Text style={style.timeText}>{time}</Text>
        </View>
      </View>


      <View style={style.avatarWrap}>
        <JamJamRive riveRef={riveRef} />
      </View>

   
      <View style={style.bgCurve}>
        <View style={style.iconRow}>
  
      <View style={{ alignItems: "center" }}>
            <Pressable
              onPress={() => navigation.replace("Main")}
              style={({ pressed }) => [
                style.exiticon,
                pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
              ]}
            >
              <Ionicons
                name="call"
                size={28}
                color="#FFF"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </Pressable>
            <Text style={style.iconLabel}>통화 종료</Text>
          </View>


      <View style={{ alignItems: "center" }}>
            <Pressable
              onPress={handleMicPress}
              style={({ pressed }) => [
                style.micBtn,
                pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
                isRecording && { backgroundColor: "#9B9898" },
              ]}
            >
              {isRecording ? (
                <View style={{ width: 24, height: 24, backgroundColor: "#FFF" }} />
              ) : (
                <Ionicons name="mic" size={28} color="#FFF" />
              )}
            </Pressable>

            <Text style={style.iconLabel}>
              {isRecording ? "녹음 중..." : "답변 준비"}
            </Text>
          </View>
      </View>
      </View >

    </SafeAreaView >
  );
}