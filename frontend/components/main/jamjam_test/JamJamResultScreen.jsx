import React, { useState } from "react";
import { SafeAreaView, View, Text, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";


const RESULT_TYPES = {
    A: {
        title: "스마일 부모",
        desc: "사랑은 많지만 규칙은 부족해요.",
        icon: <Feather name="smile" size={40} color="#FF6B6B" />
    },
    B: {
        title: "단호한 부모",
        desc: "규칙 최우선! 아이보다 원칙이 먼저.",
        icon: <Ionicons name="shield-checkmark-outline" size={40} color="#4A90E2" />
    },
    C: {
        title: "밸런스 마스터",
        desc: "애정과 규칙의 완벽한 균형!",
        icon: <MaterialCommunityIcons name="scale-balance" size={40} color="#50C878" />
    },
};
export default function JamJamResultScreen({ route, navigation }) {
    const { scores, topTypes, total } = route.params;
    const [modalVisible, setModalVisible] = useState(true);

    return (
        <SafeAreaView style={styles.safe}>
            {/* 결과 모달 */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalCard}>
                        {topTypes.length === 1 ? (
                            <>
                                {RESULT_TYPES[topTypes[0]].icon}
                                <Text style={styles.title}>당신은 {RESULT_TYPES[topTypes[0]].title}!</Text>
                                <Text style={styles.desc}>{RESULT_TYPES[topTypes[0]].desc}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.title}>당신은 두 가지 유형에 해당될 수 있습니다.</Text>
                                {topTypes.map((t) => (
                                    <View key={t} style={{ marginTop: 12, alignItems: "center" }}>
                                        <Text style={styles.emoji}>{RESULT_TYPES[t].emoji}</Text>
                                        <Text style={styles.title}>{RESULT_TYPES[t].title}</Text>
                                        <Text style={styles.desc}>{RESULT_TYPES[t].desc}</Text>
                                    </View>
                                ))}
                            </>
                        )}

                        <Pressable style={styles.btn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.btnText}>전체 유형 보기</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            {/* 결과 요약 */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Ionicons name="star" size={26} color="#FF6B6B" />
                    <Text style={styles.summaryTitle}>전체 유형</Text>
                    <Ionicons name="star" size={26} color="#FF6B6B" />
                </View>
                <View style={styles.summaryDivider} />
            </View>


            {/* 전체 유형 보기 */}
            <ScrollView style={styles.container}>

                {Object.entries(RESULT_TYPES).map(([key, t]) => (
                    <View key={key} style={styles.card}>
                        {key === "A" && <Feather name="smile" size={40} color="#FF6B6B" />}
                        {key === "B" && <Ionicons name="shield-checkmark-outline" size={40} color="#4A90E2" />}
                        {key === "C" && <MaterialCommunityIcons name="scale-balance" size={40} color="#50C878" />}

                        <Text style={styles.title}>{t.title}</Text>
                        <Text style={styles.desc}>{t.desc}</Text>
                    </View>
                ))}
            </ScrollView>
            {/* 메인으로 가기 버튼 */}
            <Pressable
                style={[styles.btn, styles.mainBtn]}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Main" }],
                    })
                }
            >
                <Text style={styles.btnText}>메인으로 가기</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: "#fff",
        margin: 16,
        padding: 24,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4, // 안드로이드 그림자
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },
    summaryDivider: {
        marginTop: 12,
        width: "40%",
        height: 3,
        backgroundColor: "#FF6B6B",
        borderRadius: 2,
    },
    summaryRow: {
        flexDirection: "row",      // 가로 배치
        alignItems: "center",      // 세로 가운데 정렬
        justifyContent: "center",  // 가로 중앙 정렬
    },

    tip: { marginTop: 8, fontSize: 14, color: "#555", textAlign: "center" },
    btnRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 24 },
    safe: { flex: 1, backgroundColor: "#FFF6F7" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalCard: { backgroundColor: "#fff", padding: 24, borderRadius: 16, width: "85%", alignItems: "center" },
    emoji: { fontSize: 42 },
    title: { fontSize: 18, fontWeight: "700", marginTop: 8 },
    desc: { fontSize: 15, textAlign: "center", marginVertical: 8 },
    btn: { backgroundColor: "#FF6B6B", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 15, marginTop: 16, alignItems: "center", margin: 50 },
    btnText: { color: "#fff", fontWeight: "800" },
    container: { padding: 16 },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, shadowOpacity: 0.1, shadowRadius: 6 },
});
