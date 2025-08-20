import React, { useMemo } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";

// 예시 상태값 (추후 props or store로 대체)
const phase = "idle"; // 'listening' | 'speaking' | 'thinking'
const caption = "텍스트 공간";

export default function VoiceCallScreen() {
  const avatarRing = useMemo(() => {
    if (phase === "listening") return style.recBorder;
    if (phase === "speaking") return style.speakBorder;
    return null;
  }, []);

  return (
    <SafeAreaView style={style.safe}>
      {/* Top */}
      <View style={style.topWrap}>
        <Text style={style.nameText}>잼잼이(육아 AI)</Text>
        <View style={style.timePill}>
          <Text style={style.timeText}>시간</Text>
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
        <View style={style.secondaryRow}>
          <IconGhost name="heart" onPress={() => { }} />
          <IconGhost name="happy" onPress={() => { }} />
          <IconGhost name="school" onPress={() => { }} />
        </View>

        {/* 스페이서 */}
        <View style={{ flex: 1 }} />

        <View style={style.bottomInner}>
          <Pressable
            onPressIn={() => { }}
            onPressOut={() => { }}
            style={({ pressed }) => [
              style.primaryMic,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
            ]}
          >
            <Ionicons name="mic" size={28} color="#FFF" />
          </Pressable>
        </View>
      </View>


    </SafeAreaView>
  );
}

function IconGhost({ name, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        style.secBtn,
        pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
      ]}
      hitSlop={8}
    >
      <Ionicons name={name} size={22} color={Colors.primary} />
    </Pressable>
  );
}

