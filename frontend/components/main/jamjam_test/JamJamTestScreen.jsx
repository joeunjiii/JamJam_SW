import React, { useMemo, useState } from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { styles, COLORS } from "./style/JamJamTestScreen.styles";
import { Ionicons, Feather } from "@expo/vector-icons";


// 질문들
const QUESTIONS = [
  {
    id: "Q1",
    text: "식사시간이 얼마 남지 않았는데도 아이가 군것질 거리를 먹겠다고 조르면?",
    weight: 1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q1.png"),
    options: [
      { key: "agree", label: "그대로 먹게 내버려 둔다" },
      { key: "disagree", label: "안 된다고 하며 못 먹게 한다." },
      { key: "mid", label: "밥을 먹고 난 다음에 후식으로만 먹게 한다." },
    ],
  },
  {
    id: "Q2",
    text: "당신의 6살 난 아이가 청소년들이 볼 수 있는 만화영화를 보겠다고 떼를 쓴다면?",
    weight: 1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q2.png"),
    options: [
      { key: "agree", label: "보도록 내버려 둔다." },
      { key: "disagree", label: "보지 못하게 TV를 끄거나 채널을 다른 프로그램으로 돌린다." },
      { key: "mid", label: "아이에게 적합한지를 직접 시청한 다음 보게 할 것인지를 결정한다." },
    ],
  },
  {
    id: "Q3",
    text: "당신의 아이가 바느질고리를 뒤집어엎어 온 방안에 헤쳐 놓았다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q3.png"),
    options: [
      { key: "agree", label: "아이이니까 그러려니 하고 손수 치운다." },
      { key: "disagree", label: "화를 내며 지금 당장 치우라고 소리친다. (당장 치워!!!)." },
      { key: "mid", label: "화를 내지는 않지만 아이에게 치우게 하고, 다 치울 때 까지 다른 일을 못하게 한다." },
    ],
  },
  {
    id: "Q4",
    text: "아이가 당신이 아끼던 꽃병을 깨놓고선 옆집 친구가 그랬다고 거짓말을 했다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q4.png"),
    options: [
      { key: "agree", label: "아깝지만 괜찮다고 이야기 한다." },
      { key: "disagree", label: "깨뜨린 것과 거짓말 한 것 모두에 대해 야단을 치거나 벌을 준다." },
      { key: "mid", label: "거짓말 한 것에 대해 야단을 치고, 만일 솔직히 얘기했더라면 꽃병을 깬 것에 대 해 혼내지 않았을 것이라고 말해준다." },
    ],
  },
  {
    id: "Q5",
    text: "7살짜리 당신의 아이가 서너 살짜리 아이들과 노는 것을 보았다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q5.png"),
    options: [
      { key: "agree", label: "속은 상하지만 그냥 놀게 내버려 둔다." },
      { key: "disagree", label: "당장 놀지 못하게 한다." },
      { key: "mid", label: "같이 놀 또래 친구들을 찾아보도록 도와준다." },
    ],
  },
  {
    id: "Q6",
    text: "당신의 아이가 다른 친구를 때려서 상처를 냈다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q6.png"),
    options: [
      { key: "agree", label: "아이들 싸움이려니 하고 그냥 내버려 둔다." },
      { key: "disagree", label: "화가 나서 야단치거나 때론 체벌을 한다." },
      { key: "mid", label: "왜 싸웠는지에 대해 이야기를 나누되, 그래도 싸움은 나쁘다고 따끔히 꾸중한다." },
    ],
  },
  {
    id: "Q7",
    text: "당신의 아이가 유치원(학교)에서 내준 숙제를 이번에도 또 잊고 안 해간다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q7.png"),
    options: [
      { key: "agree", label: "선생님께 전화를 해준다." },
      { key: "disagree", label: "그 자리에서 혼을 내고 다시는 그러지 못하도록 다짐해 둔다." },
      { key: "mid", label: "더 이상 잊어버리지 않도록 타이르고 다음부터는 알림장을 꼭 확인하도록 도와준다." },
    ],
  },
  {
    id: "Q8",
    text: "당신의 아이가 크레용으로 온 방바닥에 낙서를 했다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q8.png"),
    options: [
      { key: "agree", label: "낙서할 수 있는 종이를 한 묶음 갖다 주며 웃어넘긴다." },
      { key: "disagree", label: "아이에게 화를 내며 당신이 직접 낙서를 지운 다음, 크레용을 모두 없애 버린다." },
      { key: "mid", label: "아이 스스로 지우게 하고, 다음부터는 크레용을 가지고 놀 때 세심히 지도한다." },
    ],
  },
  {
    id: "Q9",
    text: "당신의 아이가 유치원(학교)에서 친구를 사귀는데 문제가 있다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q9.png"),
    options: [
      { key: "agree", label: "친구들을 불러서 파티를 열어주고 선물을 나누어주며 당신의 아이와 사이좋게 지내달라고 부탁한다." },
      { key: "disagree", label: "바보처럼 친구 하나도 못 사귄다고 야단을 친다." },
      { key: "mid", label: "당신의 자녀와 친구관계에 관한 이야기를 나누고, 친구를 사귈 수 있도록 단체 활동 프로그램 등에 가입시킨다." },
    ],
  },
  {
    id: "Q10",
    text: "당신의 기분이 언짢은데 자녀가 당신의 관심을 받고자 보챈다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q10.png"),
    options: [
      { key: "agree", label: "언짢은 기분은 뒤로 하고 자녀에게 관심을 기울인다." },
      { key: "disagree", label: "화를 내며 지금 당장 치우라고 소리친다. (당장 치워!!!)." },
      { key: "mid", label: "아이에게 당신의 기분이 언짢다는 것을 이야기 해주고, 좀 나아지면 함께 놀아주겠다고 한다." },
    ],
  },
  {
    id: "Q11",
    text: "당신의 아이가 블록 쌓기 놀이를 하는데 원하는 대로 잘 되지 않아서 짜증을 부린다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q11.png"),
    options: [
      { key: "agree", label: "아이의 짜증을 멈추게 하기 위해 옆에서 도와준다." },
      { key: "disagree", label: "짜증부리지 말라고 야단을 친다." },
      { key: "mid", label: "아이에게 짜증을 부리는 대신 말로 표현하도록 얘기해 주고 짜증난 이유에 대해 이야기를 나눈다." },
    ],
  },
  {
    id: "Q12",
    text: "당신의 집에는 자녀가 지켜야 할 규칙이 얼마나 많습니까?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q12.png"),
    options: [
      { key: "agree", label: "없다." },
      { key: "disagree", label: "많은 규칙이 있고, 규칙마다 이를 어겼을 시 받게 될 꾸중이나 벌이 정해져 있다." },
      { key: "mid", label: "아이의 건강과 안전을 위한 몇 가지의 규칙이 있긴 하나, 그밖에는 상황에 따라 그 때 그 때 대화를 통해 결정한다." },
    ],
  },
  {
    id: "Q13",
    text: "당신이 좋아하는 수제비를 특별히 준비하였는데 아이가 먹기 싫다고 한다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q13.png"),
    options: [
      { key: "agree", label: "귀찮더라도 아이를 위해 밥을 따로 준비한다." },
      { key: "disagree", label: "억지로라도 먹게 한다." },
      { key: "mid", label: "수제비를 조금이라도 먹어보게 한 다음 그래도 싫다면 아이를 위해 밥을 따로 준비한다." },
    ],
  },
  {
    id: "Q14",
    text: "자야 할 시간이 훨씬 지났는데도 아이가 하고 있던 놀이를 더 하고 자겠다고 고집을 피운다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q14.png"),
    options: [
      { key: "agree", label: "놀만큼 더 놀다 자게 한다." },
      { key: "disagree", label: "당장 가서 자라며 야단치거나 불을 꺼버린다." },
      { key: "mid", label: "그 시각부터 20~30분만 더 놀다 자게 한다." },
    ],
  },
  {
    id: "Q15",
    text: "당신의 아이가 다른 어른의 말을 잘 따르지 않는다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q15.png"),
    options: [
      { key: "agree", label: "아직 어리니까 그러려니 하고 내버려둔다." },
      { key: "disagree", label: "화를 내며 어쨌든 어른의 말을 따르지 않는다는 건 나쁜 일이기에 야단친다." },
      { key: "mid", label: "어른에 대한 공경심과 그 어른의 말을 왜 따라야 하는지에 대해 이야기를 나눈다." },
    ],
  },
  {
    id: "Q16",
    text: "아이와 함께 쇼핑 시, 쓸모없어 보이는 것들을 이것저것 사달라고 조른다면?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q16.png"),
    options: [
      { key: "agree", label: "가능한 다 들어준다." },
      { key: "disagree", label: "화를 내면서 아이의 손목을 잡고 그 상점을 뜬다." },
      { key: "mid", label: "안 된다고 딱 잘라 말하고, 쇼핑을 계속하면서 아이에게 적합한 것을 골라 사준다." },
    ],
  },
  {
    id: "Q17",
    text: "당신은 얼마나 자주 자녀에게 화를 냅니까?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q17.png"),
    options: [
      { key: "agree", label: "거의 드물다." },
      { key: "disagree", label: "매일 같이" },
      { key: "mid", label: "일주일에 한번 정도" },
    ],
  },
  {
    id: "Q18",
    text: "당신의 아이가 자다가 무서운 꿈을 꾸어 당신의 방에서 자겠다고 오는 경우",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q18.png"),
    options: [
      { key: "agree", label: "함께 자도록 한다." },
      { key: "disagree", label: "당장 네 방에 가서 자라고 소리 지른다." },
      { key: "mid", label: "일어나서 아이를 달래준 다음 아이를 방으로 데려가 재운다." },
    ],
  },
  {
    id: "Q19",
    text: "당신의 아이를 생각할 때, 당신이 원하는 가정의 분위기는?",
    weight: -1,
    image: require("../../../assets/main/jamjam_test/test_ill/Q19.png"),
    options: [
      { key: "agree", label: "자유롭고 개방적인 가정" },
      { key: "disagree", label: "규율과 질서가 잡힌 가정" },
      { key: "mid", label: "대화와 화합이 있는 가정" },
    ],
  },
];

export default function JamJamTestScreen({ navigation }) {
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // [{id, answer}]

  const progress = useMemo(() => (idx + 1) / total, [idx, total]);
  const current = QUESTIONS[idx];

  const keyToType = {
    agree: "A",
    disagree: "B",
    mid: "C",
  };


  const onAnswer = (choice) => {
    const q = QUESTIONS[idx];
    const updatedAnswers = [
      ...answers.filter((a) => a.id !== q.id),
      { id: q.id, answer: choice },
    ];

    setAnswers(updatedAnswers);

    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      const scores = updatedAnswers.reduce(
        (acc, a) => {
          const type = keyToType[a.answer];
          acc[type] += 1;
          return acc;
        },
        { A: 0, B: 0, C: 0 }
      );

      // 최종 유형 판별
      let topTypes = [];
      const maxScore = Math.max(scores.A, scores.B, scores.C);
      if (scores.A === maxScore) topTypes.push("A");
      if (scores.B === maxScore) topTypes.push("B");
      if (scores.C === maxScore) topTypes.push("C");

      navigation.navigate("JamJamResultScreen", {
        scores,
        topTypes,  // ["A"] 또는 ["A","C"] 식으로 전달
        total,
      });


    }

  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("Main")}
          style={styles.headerLeft}
        >
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
        <Image source={current.image} style={styles.illustration} />
      </View>

      {/* Question */}
      <View style={styles.questionWrap}>
        <Text style={styles.questionText}>{current.text}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.btnWrap}>
        {current.options.map((opt) => (
          <Pressable
            key={opt.key}
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => onAnswer(opt.key)}
          >
            <Text
              style={styles.btnPrimaryText}
              numberOfLines={0}  // 줄 수 제한 없음
              adjustsFontSizeToFit={false}  // 폰트 크기 자동 조정 비활성화
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
