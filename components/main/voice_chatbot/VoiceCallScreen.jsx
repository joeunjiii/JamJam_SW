import React, { useMemo } from "react";
import { View, Text, Image, Pressable, SafeAreaView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style, Colors } from "./style/VoiceCallScreen.styles";

// 예시 상태값 (추후 props or store로 대체)
const phase = "idle"; // 'listening' | 'speaking' | 'thinking'
const caption = "텍스트 공간";


export default function VoiceCallScreen() {
  const navigation = useNavigation();
  
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

        {/* pill 안에 시간 텍스트 넣기 */}
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
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
        ]}
      >
        <Image
          source={source}
          style={{ width: 32, height: 32, resizeMode: "contain" }}
        />
      </Pressable>
      {label && <Text style={style.iconLabel}>{label}</Text>}
    </View>
  );
}


