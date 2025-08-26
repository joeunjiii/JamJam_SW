import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Image, ScrollView, Pressable } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, COLORS } from "./style/MyPage.styles";

// 목업용 기본 데이터 백엔드연결할때 삭제
const DEFAULT_PROFILE = {
    nickname: "잼잼수달",
    email: "sudal1234@gmail.com",
    joinedAt: "2025-08-15", // YYYY-MM-DD
    status: "둘다",         // "출산예정" | "육아 중" | "해당사항 없음" | "둘다"
    dueDate: "2026-05-13",  // 출산 예정일 (status에 따라 표시)
    children: [
        { id: 1, name: "", birth: "", gender: "" },
    ],
};

export default function MyPage({ navigation }) {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);

    // 저장된 프로필 불러오기 (ProfileScreen에서 AsyncStorage에 저장했다고 가정)
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem("app_profile");
                if (raw) setProfile(JSON.parse(raw));
            } catch (e) {
                console.warn("load profile failed", e);
            }
        })();
    }, []);

    const showChildren = profile.status === "육아 중" || profile.status === "둘다";
    const showDueDate = profile.status === "출산예정" || profile.status === "둘다";

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

            <ScrollView contentContainerStyle={styles.container}>
                {/* 프로필 상단 */}
                <View style={styles.profileRow}>
                    <Image
                        source={require("../../../assets/main/mypage/sudal.png")}
                        style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                        {/* 닉네임 */}
                        <Text style={styles.nickname}>{profile.nickname}</Text>
                        {/* 이메일 */}
                        <Text style={styles.email}>{profile.email}</Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => navigation.navigate("ProfileEditScreen")}
                    style={styles.editBtn}
                >
                    <Feather name="edit-2" size={14} color="#fff" />
                    <Text style={styles.editBtnText}>프로필 편집하기</Text>
                </Pressable>

                {/* 가입시기 */}
                <View style={styles.card}>
                    <Text style={styles.label}>가입시기:</Text>
                    <View style={styles.row}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.valueText}>{formatKoreanDate(profile.joinedAt)}</Text>
                    </View>
                </View>

                {/* 자녀 프로필 (읽기전용) */}
                {showChildren && profile.children?.length > 0 && (
                    <View style={styles.card}>
                        {profile.children.map((c, idx) => (
                            <View key={c.id} style={{ marginBottom: idx < profile.children.length - 1 ? 16 : 0 }}>
                                <Text style={styles.sectionTitle}>자녀 프로필{idx + 1}</Text>

                                <Text style={styles.smallLabel}>이름</Text>
                                <View style={styles.ghostPill}>
                                    <Text style={styles.ghostText}>{c.name || "—"}</Text>
                                </View>

                                <Text style={styles.smallLabel}>생년월일</Text>
                                <View style={styles.ghostPill}>
                                    <Text style={styles.ghostText}>{c.birth || "—"}</Text>
                                </View>

                                <Text style={styles.smallLabel}>성별</Text>
                                <View style={styles.ghostPill}>
                                    <Text style={styles.ghostText}>{c.gender || "—"}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* 출산 예정일 */}
                {showDueDate && !!profile.dueDate && (
                    <View style={styles.dueCard}>
                        <View style={styles.dueBadge}>
                            <Text style={styles.dueBadgeText}>출산 예정일</Text>
                        </View>

                        <Image
                            source={require("../../../assets/main/mypage/Happy baby-pana.png")} // ← 이미지 경로 맞게 수정
                            style={styles.dueImage}
                            resizeMode="contain"
                        />

                        <Text style={styles.dueDateText}>{formatDotDate(profile.dueDate)}</Text>

                        <Text style={styles.dueDescription}>
                            엄마를 만나기까지{" "}
                            <Text style={styles.dueHighlight}>{daysUntil(profile.dueDate)}</Text>
                            일 남았어요!
                        </Text>
                    </View>
                )}


                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function formatKoreanDate(yyyy_mm_dd) {
    if (!yyyy_mm_dd) return "—";
    try {
        const [y, m, d] = yyyy_mm_dd.split("-").map((n) => parseInt(n, 10));
        if (isNaN(y) || isNaN(m) || isNaN(d)) return "—";
        return `${y}년 ${m}월 ${d}일`;
    } catch (error) {
        return "—";
    }
}

function formatDotDate(yyyy_mm_dd) {
    if (!yyyy_mm_dd) return "—";
    try {
        const [y, m, d] = yyyy_mm_dd.split("-").map((n) => {
            const num = parseInt(n, 10);
            return isNaN(num) ? "00" : `${num}`.padStart(2, "0");
        });
        if (isNaN(parseInt(y)) || isNaN(parseInt(m)) || isNaN(parseInt(d))) return "—";
        return `${y}.${m}.${d}`;
    } catch (error) {
        return "—";
    }
}

function daysUntil(dueDate) {
    if (!dueDate) return "-";
    try {
        const target = new Date(dueDate);
        const today = new Date();

        // 시, 분, 초 제거
        const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
        const t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        const diff = Math.floor((t1 - t2) / (1000 * 60 * 60 * 24));
        return diff;
    } catch (e) {
        return "-";
    }
}
