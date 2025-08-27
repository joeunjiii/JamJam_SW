import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Image, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/MyPage.styles";
import ProfileService from "../../login/service/ProfileService";
import { storage } from "../../login/service/storage";

export default function MyPage({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = await storage.getItem("userId");
                if (!userId) throw new Error("로그인이 필요합니다.");
                const data = await ProfileService.getProfile(userId);
                const converted = ProfileService.convertFromApiFormat(data);
                setProfile(converted);
            } catch (e) {
                console.error("프로필 로드 실패:", e);
                Alert.alert("오류", "프로필 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 12 }}>불러오는 중...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text style={{ margin: 20 }}>프로필이 없습니다.</Text>
                <Pressable onPress={() => navigation.navigate("ProfileScreen")}>
                    <Text style={{ color: COLORS.primary }}>프로필 만들기</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

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
                        source={
                            profile.profileImageUrl
                                ? { uri: profile.profileImageUrl }
                                : require("../../../assets/main/mypage/profile.png")
                        }
                        style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nickname}>{profile.nickname}</Text>
                        <Text style={styles.email}>ID: {profile.userId}</Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => navigation.navigate("ProfileEditScreen", { profile })}
                    style={styles.editBtn}
                >
                    <Feather name="edit-2" size={14} color="#fff" />
                    <Text style={styles.editBtnText}>프로필 편집하기</Text>
                </Pressable>

                {/* 가입일 */}
                <View style={styles.card}>
                    <Text style={styles.label}>가입시기:</Text>
                    <View style={styles.row}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.valueText}>
                            {profile.createdAt
                                ? formatKoreanDate(profile.createdAt)
                                : "—"}
                        </Text>
                    </View>
                </View>

                {/* 자녀 */}
                {showChildren && profile.children?.length > 0 && (
                    <View style={styles.card}>
                        {profile.children.map((c, idx) => (
                            <View key={c.id} style={{ marginBottom: 12 }}>
                                <Text style={styles.sectionTitle}>자녀 {idx + 1}</Text>
                                <Text>이름: {c.name}</Text>
                                <Text>생년월일: {c.birth}</Text>
                                <Text>성별: {c.gender}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* 출산 예정일 */}
                {showDueDate && profile.dueDate && (
                    <View style={styles.dueCard}>
                        <View style={styles.dueBadge}>
                            <Text style={styles.dueBadgeText}>출산 예정일</Text>
                        </View>

                        <Image
                            source={require("../../../assets/main/mypage/Happy baby-pana.png")}
                            style={styles.dueImage}
                            resizeMode="contain"
                        />

                        <Text style={styles.dueDateText}>{formatDotDate(profile.dueDate)}</Text>
                        <Text style={styles.dueDescription}>
                            아기를 만나기까지{" "}
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

/* === 유틸 함수 === */
function formatKoreanDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
function formatDotDate(date) {
    if (!date) return "—";
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
        d.getDate()
    ).padStart(2, "0")}`;
}
function daysUntil(dueDate) {
    if (!dueDate) return "-";
    const target = new Date(dueDate);
    const today = new Date();
    const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    const t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return Math.floor((t1 - t2) / (1000 * 60 * 60 * 24));
}
