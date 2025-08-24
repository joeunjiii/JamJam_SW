import React from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../style/Community.styles";

export default function NoticeModal({ visible, onClose }) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            {/* 반투명 오버레이 */}
            <View style={s.overlay}>
                {/* 카드 모달 */}
                <View style={s.modalCard}>
                    {/* 상단 아이콘 + 타이틀 */}
                    <View style={s.header}>
                        <Ionicons name="alert-circle" size={28} color={COLORS.primary} />
                        <Text style={s.headerTitle}>게시판 이용 규칙</Text>
                        <Pressable onPress={onClose} style={s.closeBtn}>
                            <Ionicons name="close" size={22} color="#888" />
                        </Pressable>
                    </View>

                    {/* 내용 스크롤 */}
                    <ScrollView style={s.body}>
                        <Text style={s.rule}>광고/홍보성 게시물은 금지됩니다.</Text>
                        <Text style={s.rule}>욕설·비방·차별 발언은 삭제될 수 있습니다.</Text>
                        <Text style={s.rule}>개인정보(연락처, 주소 등) 노출 주의하세요.</Text>
                        <Text style={s.rule}>타인을 존중하는 글쓰기 문화를 지켜주세요.</Text>
                    </ScrollView>

                    {/* 확인 버튼 */}
                    <Pressable style={s.okBtn} onPress={onClose}>
                        <Text style={s.okBtnText}>확인했어요</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
        color: COLORS.text,
    },
    closeBtn: {
        padding: 4,
    },
    body: {
        marginBottom: 20,
    },
    rule: {
        fontSize: 14,
        color: "#444",
        marginBottom: 10,
        lineHeight: 20,
    },
    okBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    okBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
