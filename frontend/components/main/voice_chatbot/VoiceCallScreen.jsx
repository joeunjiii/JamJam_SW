import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";
import { fetchCaption, startTimer, stopTimer } from "./service/voiceService";
import { Audio } from "expo-av";
export default function VoiceCallScreen() {
  const navigation = useNavigation();

  const [phase, setPhase] = useState("idle"); // 'listening' | 'speaking' | 'thinking'
  const [caption, setCaption] = useState("텍스트 공간");
  const [time, setTime] = useState("00:00");

  const [recording, setRecording] = useState(null); // 🔹 녹음 상태
  const [uri, setUri] = useState(null); // 🔹 저장된 파일 경로

  const avatarRing = useMemo(() => {
    if (phase === "listening") return style.recBorder;
    if (phase === "speaking") return style.speakBorder;
    return null;
  }, [phase]);


  // 타이머 시작/정지
  useEffect(() => {
    startTimer(setTime);
    return () => stopTimer();
  }, []);

  useEffect(() => {
    fetchCaption(phase).then(setCaption);
  }, [phase]);



  // 🎙️ 녹음 시작
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("마이크 권한 필요합니다!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log("🎙️ 녹음 시작...");
    } catch (err) {
      console.error("녹음 에러:", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log("⚠️ recording 없음, 이미 중지됨");
        return null;
      }

      console.log("🛑 녹음 종료...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setUri(uri);
      setRecording(null);

      console.log("📂 저장된 파일 경로:", uri);
      return uri;
    } catch (err) {
      console.error("녹음 종료 에러:", err);
    }
  };


  const sendToWhisper = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recording.m4a",
        type: "audio/m4a",
      });
      formData.append("model", "whisper-1");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`, // 🔑 API Key
          },
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Whisper 응답 전체:", data);

      if (!response.ok) {
        console.error("Whisper API 에러:", data.error?.message || data);
        return;
      }

      console.log("📝 Whisper 변환 결과:", data.text);
    } catch (err) {
      console.error("Whisper API 호출 에러:", err);
    }
  };


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
        {/* 🎙️ 녹음 시작 버튼 */}
        <Pressable
          onPress={startRecording}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "green",
            borderRadius: 8,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>녹음 시작</Text>
        </Pressable>

        {/* 🛑 녹음 종료 버튼 */}
        <Pressable
          onPress={async () => {
            const uri = await stopRecording();
            if (uri) {
              console.log("🎧 파일 경로:", uri);
              await sendToWhisper(uri); // 🔥 Whisper API 호출
            }
          }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "red",
            borderRadius: 8,
          }}
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


