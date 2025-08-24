import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Image, Animated, InteractionManager } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { styles, COLORS } from "./style/PolicyCurationQuestionScreen.styles";

import { requestFilterPolicies } from "./api/policy";

// ✅ 질문 정의 (섹션 구조 그대로 유지)
const QUESTIONS = [
  {
    key: "basicInfo",
    title: "기본 정보",
    questions: [
      {
        key: "region",
        type: "choice",
        prompt: "현재 거주지는 어디인가요?",
        options: [
          { label: "동구", value: "GJ-DG" },
          { label: "서구", value: "GJ-SG" },
          { label: "남구", value: "GJ-NM" },
          { label: "북구", value: "GJ-BG" },
          { label: "광산구", value: "GJ-GS" },
        ],
      },
      {
        key: "pregnancyStatus",
        type: "radio",
        prompt: "현재 어떤 상황에 해당되시나요?",
        options: [
          { label: "임신 준비 중", value: "preconception" },
          { label: "임신 중", value: "pregnant" },
          { label: "출산 후", value: "postpartum" },
          { label: "9세 미만 자녀 양육 중", value: "childcare_under9" },
        ],
      },
      {
        key: "newbornOrder",
        type: "choice",
        prompt: "현재 몇째 아이를 출산(또는 출산 예정)인가요?",
        options: [
          { label: "첫째", value: "1" },
          { label: "둘째", value: "2" },
          { label: "셋째", value: "3" },
          { label: "넷째 이상", value: "4plus" },
        ],
      },
    ],
  },
  {
    key: "incomeAndFamily",
    title: "가구 및 소득 정보",
    questions: [
      {
        key: "incomeClass",
        type: "radio",
        prompt: "가구의 소득 수준은 어느 정도인가요?",
        options: [
          { label: "기초생활수급자", value: "basic" },
          { label: "차상위계층", value: "near_poor" },
          { label: "중위소득 150% 이하", value: "lte_150pct_median" },
          { label: "해당 없음", value: "any" },
        ],
      },
      {
        key: "familyType",
        type: "choice",
        prompt: "가정 유형을 선택해주세요",
        options: [
          { label: "일반가정", value: "normal" },
          { label: "한부모가정", value: "single_parent" },
          { label: "다문화가정", value: "multicultural" },
          { label: "결혼이민가정", value: "marriage_migrant" },
          { label: "북한이탈주민(새터민)", value: "north_korean_defector" },
        ],
      },
    ],
  },
  {
    key: "specialCases",
    title: "특수 상황",
    questions: [
      {
        key: "disability",
        type: "radio",
        prompt: "장애인 등록 여부를 알려주세요",
        options: [
          { label: "등록 장애인", value: "true" },
          { label: "해당 없음", value: "false" },
        ],
      },
      {
        key: "disabilitySeverity",
        type: "radio",
        prompt: "장애 정도에 해당되시나요?",
        options: [
          { label: "중증", value: "severe" },
          { label: "해당 없음", value: "any" },
        ],
      },
      {
        key: "specialCase",
        type: "choice",
        prompt: "특수한 상황이 있으신가요?",
        options: [
          { label: "쌍둥이/다태아 출산", value: "multiple_birth" },
          { label: "희귀질환·중증난치질환 산모", value: "rare_disease" },
          { label: "장애 신생아 출산", value: "disabled_newborn" },
          { label: "미혼모", value: "single_parent" },
          { label: "해당 없음", value: "none" },
        ],
      },
    ],
  },
];


const loadPolicies = async () => {
  const data = await requestFilterPolicies({
    regionCode: "GJ",
    pregnancyStatus: "parent",
    monthsInCityAtBirth: 12,
    newbornOrder: 1,
    familyType: "single",
    disability: false,
    incomeClass: "basic"
  });

  console.log("정책 결과:", data);
};

const buildPayloadFromAnswers = (answers) => ({
  regionCode: answers.region?.split("-")[0] || "GJ",
  pregnancyStatus: answers.pregnancyStatus || null,
  newbornOrder: parseInt(answers.newbornOrder) || 1,
  monthsInCityAtBirth: 12,
  familyType: answers.familyType || null,
  disability: answers.disability === "true",
  incomeClass: answers.incomeClass || null,
});

export default function PolicyCurationQuestionScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [matchedCount, setMatchedCount] = useState(5);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const allQuestions = useMemo(() => QUESTIONS.flatMap((sec) => sec.questions), []);
  const isLastStep = step >= allQuestions.length;
  const scrollRef = useRef(null);


  // 지금까지 노출된 질문
  const visibleQuestions = allQuestions.slice(0, step + 1);

  const handleSelect = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    setStep((s) => s + 1); // 다음 질문 보이게
  };

  const handleNext = () => {
    console.log("📝 최종 답변:", answers);

    setAnalyzing(true);
    setCountdown(4);

    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigation.navigate("PolicyCurationResult", { answers, matchedCount });
        }
        return c - 1;
      });
    }, 1000);
  };

  // const handleNext = async () => {
  //   console.log("📝 최종 답변:", answers);
  //   const payload = buildPayloadFromAnswers(answers);
  //   console.log("📦 API 전송 데이터:", payload);

  //   setAnalyzing(true);
  //   setCountdown(4);

  //   Animated.timing(overlayOpacity, {
  //     toValue: 1,
  //     duration: 220,
  //     useNativeDriver: true,
  //   }).start();

  //   // ✅ API 요청
  //   try {
  //     const filteredPolicies = await requestFilterPolicies(payload);
  //     console.log("🎯 받은 정책 목록:", filteredPolicies);
  //     setMatchedCount(filteredPolicies.length); // 결과 수 반영

  //     const timer = setInterval(() => {
  //       setCountdown((c) => {
  //         if (c <= 1) {
  //           clearInterval(timer);
  //           navigation.navigate("PolicyCurationResult", { answers, matchedCount: filteredPolicies.length, policies: filteredPolicies });
  //         }
  //         return c - 1;
  //       });
  //     }, 1000);
  //   } catch (error) {
  //     console.error("❌ 정책 필터링 실패:", error);
  //     // 에러처리 로직 넣을 수 있음
  //   }
  // };

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
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              몇 가지 정보만 알려주시면{"\n"}잼잼수달님께 딱 맞는 정책을 알려드릴게요
            </Text>
          </View>

          {visibleQuestions.map((q, idx) => {
            const answered = answers[q.key] !== undefined;
            const isCurrent = idx === step;

            return (
              <View key={q.key}>
                {/* 질문 + 선택지 묶음 */}
                <View style={styles.questionBlock}>
                  {/* 질문 말풍선 */}
                  <Text style={styles.chatText}>{q.prompt}</Text>


                  {/* 현재 질문인 경우에만 옵션 보여주기 */}
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

                {/* 답변 말풍선 (오른쪽) — 묶음 밖에 위치 */}
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


          {/* 마지막 버튼 */}
          {isLastStep && (
            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>다음</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* 분석 오버레이 */}
      {
        analyzing && (
          <Animated.View style={[styles.analysisOverlay, { opacity: overlayOpacity }]}>
            <LinearGradient
              colors={["rgba(255,107,107,0.18)", "rgba(255,107,107,0.06)", "rgba(255,255,255,0)"]}
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
              <Text style={styles.analysisSub}>{countdown}초 후 페이지가 이동합니다</Text>
            </View>
          </Animated.View>
        )
      }
    </View >
  );
}
