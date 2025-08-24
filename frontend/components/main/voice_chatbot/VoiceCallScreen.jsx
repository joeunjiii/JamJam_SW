import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";
import { fetchCaption, startTimer, stopTimer } from "./service/voiceService";

export default function VoiceCallScreen() {
  const navigation = useNavigation();

  const [phase, setPhase] = useState("idle"); // 'listening' | 'speaking' | 'thinking'
  const [caption, setCaption] = useState("텍스트 공간");
  const [time, setTime] = useState("00:00");

  const avatarRing = useMemo(() => {
    if (phase === "listening") return style.recBorder;
    if (phase === "speaking") return style.speakBorder;
    return null;
  }, [phase]);


  // ⏱ 타이머 시작/정지
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


      {/* 육아 AI 사진*/}
      <View style={style.avatarWrap}>
        <View style={[style.avatarOuter, avatarRing]}>
          {/* speaking/listening glow */}
          {(phase === "listening" || phase === "speaking") && <View style={style.avatarGlow} />}
          <Image source={require("../../../assets/main/voicecallscreen/modify.png")} style={style.avatar} />
        </View>
        {/* Caption */}
        <View style={style.captionWrap}>
          <Text style={style.captionText}>{caption}</Text>
        </View>
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


