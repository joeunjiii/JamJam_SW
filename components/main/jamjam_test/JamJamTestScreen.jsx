import React, { useMemo, useState } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { styles, COLORS } from "./style/JamJamTestScreen.styles";
import { Ionicons, Feather } from "@expo/vector-icons";

// 샘플 질문들
const QUESTIONS = [
  {
    id: "Q1",
    text: "유치원이나 학교, 학원보다 나만의 교육방법으로 아이를 키우고싶다.",
    weight: 1,
  },
  { id: "Q2", text: "나는 아이의 감정표현을 매우 중요하게 생각한다.", weight: 1 },
  { id: "Q3", text: "아이의 스케줄은 부모가 먼저 계획해주는 편이 좋다.", weight: -1 },
];

export default function JamJamTestScreen({ navigation }) {
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // [{id, answer}]

  const progress = useMemo(() => (idx + 1) / total, [idx, total]);
  const current = QUESTIONS[idx];

  const onAnswer = (choice) => {
    const q = QUESTIONS[idx];
    const next = [...answers.filter(a => a.id !== q.id), { id: q.id, answer: choice }];
    setAnswers(next);

    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      const score = next.reduce((acc, a) => {
        const rule = QUESTIONS.find(q => q.id === a.id);
        const delta = a.answer === "agree" ? rule.weight : 0;
        return acc + delta;
      }, 0);

      navigation.navigate("JamJamResult", { answers: next, score, total });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
        </Pressable>

        <Image
          source={require("../../../assets/main/namelogo.png")}
          style={{ width: 100, height: 40, resizeMode: "contain" }}
        />

        <Feather name="bell" size={20} color={COLORS.text} />
      </View>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{idx + 1}/{total}</Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationWrap}>
        {/* 필요 시 각 문항별 이미지로 교체 */}
        <Image
          source={require("../../../assets/main/jamjam_test/test_sample.png")}
          style={styles.illustration}
        />
      </View>

      {/* Question */}
      <View style={styles.questionWrap}>
        <Text style={styles.questionText}>{current.text}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.btnWrap}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => onAnswer("agree")}>
          <Text style={styles.btnPrimaryText}>그렇다</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => onAnswer("disagree")}>
          <Text style={styles.btnGhostText}>아니다</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
