import React, { useRef } from "react";
import {
    View,
    Text,
    Pressable,
    Dimensions,
    SafeAreaView,
    Image,
    Animated,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/PolicyCurationOnboarding.styles";
import { Image as ExpoImage } from "expo-image";

const { width } = Dimensions.get("window");


const SLIDES = [
    {
        title: "육아 맞춤 정책을 한눈에!",
        subtitle: "복잡한 정보, 내 상황에 딱 맞는 것만 알려드릴게요.",
        image: require("../../../assets/main/policycuration/policy_1.png"),
        bgColor: "#FFF6F7",
    },
    {
        title: "몇 가지 질문만 답해주세요",
        subtitle: "아이 유무, 소득, 거주지 등 간단한 정보로 맞춤 추천을 받을 수 있어요.",
        image: require("../../../assets/main/policycuration/policy_2.png"),
        bgColor: "#F0FAFF",
    },
    {
        title: "걱정 마세요!",
        subtitle: "입력하신 정보는 저장되지 않으며, 추천용도로만 사용됩니다.",
        image: require("../../../assets/main/policycuration/policy_3.png"),
        bgColor: "#F8FFF0",
    },
];

export default function PolicyCurationOnboarding({ navigation, onDone }) {
    const scrollX = useRef(new Animated.Value(0)).current;  // 1. scrollX 정의

    const headerBg = scrollX.interpolate({                // 2. headerBg 정의
        inputRange: SLIDES.map((_, i) => i * width),
        outputRange: SLIDES.map((s) => s.bgColor),
        extrapolate: "clamp",
    });
    const containerBg = scrollX.interpolate({
        inputRange: SLIDES.map((_, i) => i * width),
        outputRange: SLIDES.map((s) => s.bgColor),
        extrapolate: "clamp",
    });

    const scrollRef = useRef(null);


    const handleDone = () => {
        if (onDone) return onDone();
        navigation?.replace?.("PolicyCurationQuestionScreen");
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor: containerBg }]}>
            {/* 헤더 */}
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View style={[styles.header, { backgroundColor: headerBg }]}>
                    <Pressable onPress={() => navigation?.goBack?.()} hitSlop={8}>
                        <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                    </Pressable>
                    <Image
                        source={require("../../../assets/main/namelogo.png")}
                        style={{ width: 100, height: 40, resizeMode: "contain" }}
                    />
                    <Feather name="bell" size={20} color={COLORS.text} />
                </Animated.View>

                {/* 슬라이드 */}
                <Animated.ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                >
                    {SLIDES.map((s, idx) => (
                        <View
                            key={idx}
                            style={[styles.slide, { width, backgroundColor: s.bgColor }]}
                        >
                            {/* Lottie 애니메이션 */}
                            <LottieView
                                source={s.animation}
                                autoPlay
                                loop
                                style={styles.lottie}
                                resizeMode="contain"
                            />

                            {/* 텍스트 */}
                            <Text style={styles.title}>{s.title}</Text>
                            <Text style={styles.subtitle}>{s.subtitle}</Text>

                            {/* 네비게이션 도트 */}
                            <View style={styles.dotsRow}>
                                {SLIDES.map((_, i) => {
                                    const inputRange = [
                                        (i - 1) * width,
                                        i * width,
                                        (i + 1) * width,
                                    ];
                                    const dotW = scrollX.interpolate({
                                        inputRange,
                                        outputRange: [6, 20, 6],
                                        extrapolate: "clamp",
                                    });
                                    const opacity = scrollX.interpolate({
                                        inputRange,
                                        outputRange: [0.3, 1, 0.3],
                                        extrapolate: "clamp",
                                    });
                                    return (
                                        <Animated.View
                                            key={`dot-${i}`}
                                            style={[styles.dot, { width: dotW, opacity }]}
                                        />
                                    );
                                })}
                            </View>

                            {/* CTA 버튼 - 마지막 슬라이드 */}
                            {idx === SLIDES.length - 1 && (
                                <Pressable onPress={handleDone} style={styles.ctaButton}>
                                    <Text style={styles.ctaText}>시작하기</Text>
                                </Pressable>
                            )}
                        </View>
                    ))}
                </Animated.ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
}
