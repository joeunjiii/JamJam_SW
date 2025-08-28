import { StyleSheet } from "react-native";

export const COLORS = {
    bg: "#FFF6F7",
    primary: "#FF6B6B",
    text: "#222222",
    card: "#FFFFFF",
    outline: "#E6E6E6",
    subtle: "#F6EDEF",
    shadow: "rgba(0,0,0,0.08)",
    gray: "#9AA0A6",
};

export const TABS = [
    { key: "all", label: "전체글" },
    { key: "free", label: "자유 게시판" },
    { key: "qa", label: "QA" },
    { key: "notice", label: "공지사항" },
];

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },

    // 헤더
    header: {
        height: 52,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: { padding: 6, paddingRight: 10 },
    headerBack: { fontSize: 22, color: COLORS.primary, fontWeight: "600" },
    headerTitle: { fontSize: 22, fontWeight: "900", color: COLORS.primary },

    // 탭 영역
    tabsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
    },

    tabGroup: {
        marginLeft: 15,
        flexDirection: "row",
        justifyContent: "flex-start",
        flex: 1,
    },
    tabBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F3F3",
        marginHorizontal: 6,
        alignItems: "center",
        justifyContent: "center",
    },

    tabBtnActive: {
        backgroundColor: COLORS.primary,
    },

    tabText: {
        fontSize: 14,
        color: "#555",
        fontWeight: "500",
    },

    tabTextActive: {
        color: "#fff",
        fontWeight: "700",
    },

    iconImage: {
        width: 40,
        height: 40,
        // ❌ resizeMode 제거 - Image 컴포넌트의 prop으로 이동
        marginBottom: 2,
    },

    iconText: {
        fontSize: 10,
        color: "#FF6B6B",
        textAlign: "center",
        lineHeight: 14,
    },

    underline: {
        marginTop: 2,
        height: 2,
        backgroundColor: "#FF6B6B",
        width: "100%",
    },

    newDotWrapper: {
        position: "absolute",
        left: -12,
        top: 8,
    },
    newDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "red",
        marginTop: 16,
    },

    // 필독 스타일
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
        paddingHorizontal: 4,
    },

    pinnedItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    pinnedLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    pinnedIcon: {
        marginRight: 6,
        fontSize: 14,
    },

    pinnedTitle: {
        fontSize: 14,
        color: "#333",
    },

    pinnedComment: {
        fontSize: 12,
        color: "#888",
    },

    pinnedBadge: {
        backgroundColor: "#888",
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: 4,
        alignSelf: "flex-start",
        marginLeft: 3
    },

    pinnedBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },

    // 리스트 아이템
    item: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#F2E7E8",
        marginHorizontal: 0,
        paddingHorizontal: 14,
    },

    badgeNow: {
        color: COLORS.primary,
        fontWeight: "800",
        fontSize: 12,
    },

    title: {
        marginTop: 2,
        fontSize: 15,
        color: COLORS.text,
        fontWeight: "800",
        marginBottom: 15,
    },

    thumbBox: {
        marginTop: 10,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#eee",
    },

    metaRow: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    metaText: {
        fontSize: 12,
        color: "#666"
    },

    dot: {
        color: "#bbb"
    },

    // 댓글 말풍선
    commentBubble: {
        width: 48,
        height: 56,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F4F4",
        borderRadius: 12,
    },

    commentCount: {
        fontWeight: "900",
        color: "#80868B",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 5,
    },

    commentLabel: {
        marginTop: -4,
        fontSize: 12,
        color: "#A0A5AA"
    },

    // 디테일
    detailTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: COLORS.text,
        marginBottom: 4
    },

    detailContent: {
        marginTop: 14,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.text,
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.outline,
    },

    // 입력
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: COLORS.outline,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.text,
    },

    // 기타
    btnPrimary: {
        backgroundColor: "#E17060",
        alignItems: "center",
        justifyContent: "center",
    },

    btnPrimaryText: {
        color: "white",
        fontSize: 16,
        fontWeight: "800"
    },

    footerText: {
        textAlign: "center",
        paddingVertical: 16,
        color: "#777",
    },

    // FAB - 그림자 설정 수정
    fab: {
        position: "absolute",
        right: 18,
        bottom: 24,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E17060",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        // ✅ 올바른 shadow 설정
        shadowColor: "#000",      // 색상만 지정
        shadowOpacity: 0.08,       // 투명도 분리
        shadowRadius: 8,
        shadowOffset: {            // offset 추가 (iOS)
            width: 0,
            height: 2,
        },
    },

    fabPlus: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
        marginTop: -2
    },
});