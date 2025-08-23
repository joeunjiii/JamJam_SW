import { StyleSheet } from "react-native";

export const COLORS = {
    bg: "#FFF6F7",     // 핑크 배경
    primary: "#FF6B6B",
    text: "#222222",
};

const HEADER_H = 120;
export const layoutStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.bg, // 핑크 바탕
        position: "relative",
    },
    container: {
        flex: 1,
        position: "relative",
        zIndex: 1, // 본문 레이어
    },
    bgCurveBox: {
        position: "absolute",
        top: HEADER_H,  // 헤더 영역만큼 아래에서 시작
        left: 0,
        right: 0,
        height: 1300,
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        zIndex: 0, // 분홍색(wrapper) 위, 컨텐츠 아래

        // 🔽 그림자
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 }, // 위쪽 방향 그림자
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 6, // 안드로이드
    },
    header: {
        height: 56,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 3, // 헤더가 맨 위
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 12, // 곡선 아래 살짝 여백
    },
});
