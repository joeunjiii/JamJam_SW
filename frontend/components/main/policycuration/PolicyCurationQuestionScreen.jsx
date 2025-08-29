import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Animated,
  InteractionManager,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { styles, COLORS } from "./style/PolicyCurationQuestionScreen.styles";
import { requestFilterPolicies } from "./api/policy";

// 정책 큐레이션 질문 정의
const QUESTIONS = [
  {
    section: "기본 정보",
    questions: [
      {
        key: "region",
        prompt: "어느 지역에 거주하고 계신가요?",
        options: [
          { value: "광주광역시", label: "광주광역시" },
          { value: "서울특별시", label: "서울특별시" },
          { value: "부산광역시", label: "부산광역시" },
          { value: "대구광역시", label: "대구광역시" },
          { value: "인천광역시", label: "인천광역시" },
          { value: "대전광역시", label: "대전광역시" },
          { value: "울산광역시", label: "울산광역시" },
          { value: "세종특별자치시", label: "세종특별자치시" },
          { value: "경기도", label: "경기도" },
          { value: "강원도", label: "강원도" },
          { value: "충청북도", label: "충청북도" },
          { value: "충청남도", label: "충청남도" },
          { value: "전라북도", label: "전라북도" },
          { value: "전라남도", label: "전라남도" },
          { value: "경상북도", label: "경상북도" },
          { value: "경상남도", label: "경상남도" },
          { value: "제주특별자치도", label: "제주특별자치도" }
        ]
      },
      {
        key: "currentStatus",
        prompt: "현재 어떤 상황이신가요?",
        options: [
          { value: "pregnant", label: "임신 중" },
          { value: "newborn", label: "신생아 양육 중" },
          { value: "infant", label: "영유아 양육 중" },
          { value: "preschool", label: "취학 전 아동 양육 중" },
          { value: "school", label: "학령기 아동 양육 중" }
        ]
      },
      {
        key: "childbirthStatus",
        prompt: "출산 경험이 있으신가요?",
        options: [
          { value: "yes", label: "네, 출산 경험이 있습니다" },
          { value: "pregnant", label: "아니요, 현재 임신 중입니다" },
          { value: "no", label: "아니요, 출산 경험이 없습니다" }
        ]
      },
      {
        key: "marriageStatus",
        prompt: "혼인 상태는 어떻게 되시나요?",
        options: [
          { value: "married", label: "기혼" },
          { value: "single", label: "미혼" },
          { value: "divorced", label: "이혼" }
        ]
      },
      {
        key: "childrenCount",
        prompt: "양육 중인 자녀는 몇 명인가요?",
        options: [
          { value: "1", label: "1명" },
          { value: "2", label: "2명" },
          { value: "3", label: "3명" },
          { value: "4", label: "4명" },
          { value: "5", label: "5명 이상" }
        ]
      },
      {
        key: "incomeClass",
        prompt: "소득 수준은 어느 정도인가요?",
        options: [
          { value: "basic", label: "기초생활보장 수급자 (소득인정액 기준 30% 이하)" },
          { value: "near_poor", label: "차상위계층 (소득인정액 기준 50% 이하)" },
          { value: "lte_150pct_median", label: "중위소득 150% 이하" },
          { value: "over_150pct_median", label: "중위소득 150% 초과" }
        ]
      }
    ]
  }
];

const buildPayloadFromAnswers = (answers) => {
  return {
    region: answers.region || "광주광역시",
    current_status: answers.currentStatus ? [answers.currentStatus] : [],
    childbirth_status:
      answers.childbirthStatus === "yes"
        ? 1
        : answers.childbirthStatus === "pregnant"
          ? 2
          : 0,
    marriage_status:
      answers.marriageStatus === "married"
        ? 1
        : answers.marriageStatus === "single"
          ? 2
          : 0,
    children_count: answers.childrenCount
      ? parseInt(answers.childrenCount, 10)
      : null,
    income:
      answers.incomeClass === "lte_150pct_median"
        ? 150
        : answers.incomeClass === "basic"
          ? 30
          : answers.incomeClass === "near_poor"
            ? 50
            : null,
  };
};


export default function PolicyCurationQuestionScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const allQuestions = useMemo(() => QUESTIONS.flatMap((sec) => sec.questions), []);
  const isLastStep = step >= allQuestions.length;
  const scrollRef = useRef(null);

  // 지금까지 노출된 질문
  const visibleQuestions = allQuestions.slice(0, step + 1);

  const handleSelect = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    setStep((s) => s + 1);
  };

  const handleNext = async () => {
    const payload = buildPayloadFromAnswers(answers);
    console.log("📦 API 전송 데이터:", payload);

    setAnalyzing(true);
    setCountdown(4);

    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    try {
      const recommendedPolicies = await requestFilterPolicies(payload);

      let timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            navigation.navigate("PolicyCurationResult", {
              answers,
              matchedCount: recommendedPolicies.length,
              policies: recommendedPolicies,
            });
          }
          return c - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("❌ 추천 API 호출 실패:", error);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => task.cancel();
  }, [step]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bgCurveBox} />

      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation?.goBack?.()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
          </Pressable>
          <Image
            source={require("../../../assets/main/namelogo.png")}
            style={{ width: 100, height: 40, resizeMode: "contain" }}
          />
          <Feather name="bell" size={20} color={COLORS.text} />
        </View>

        {/* 채팅형 설문 */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
             {/* 회원 이름으로 변경해야합니다 */}
            <Text style={styles.introText}>
              몇 가지 정보만 알려주시면{"\n"}잼잼수달님께 딱 맞는 정책을 알려드릴게요
            </Text>
          </View>

          {visibleQuestions.map((q, idx) => {
            const answered = answers[q.key] !== undefined;
            const isCurrent = idx === step;

            return (
              <View key={q.key}>
                <View style={styles.questionBlock}>
                  <Text style={styles.chatText}>{q.prompt}</Text>

                  {isCurrent && !answered && (
                    <View style={styles.optionsGroup}>
                      {q.options.map((opt) => (
                        <Pressable
                          key={opt.value}
                          style={styles.optionBtn}
                          onPress={() => handleSelect(q, opt.value)}
                        >
                          <Text style={styles.optionText}>{opt.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {answered && (
                  <View style={styles.chatBubbleRight}>
                    <Text style={styles.chatTextRight}>
                      {q.options.find((o) => o.value === answers[q.key])?.label}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          {isLastStep && (
            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>다음</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* 분석 오버레이 */}
      {analyzing && (
        <Animated.View
          style={[styles.analysisOverlay, { opacity: overlayOpacity }]}
        >
          <LinearGradient
            colors={[
              "rgba(255,107,107,0.18)",
              "rgba(255,107,107,0.06)",
              "rgba(255,255,255,0)",
            ]}
            style={styles.overlayGradient}
          />
          <View style={styles.analysisBox}>
            <Image
              source={require("../../../assets/main/policycuration/eye.png")}
              style={styles.analysisEyes}
            />
            <Text style={styles.analysisTitle}>
              지금 신청할 수 있는 지원정책을 찾고있습니다.
            </Text>
            <Text style={styles.analysisSub}>
              {countdown}초 후 페이지가 이동합니다
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
