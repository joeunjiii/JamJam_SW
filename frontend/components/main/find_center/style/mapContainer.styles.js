import { Dimensions, StyleSheet } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export const COLORS = {
    bg: "#FFE29D",
    white: "#ffffff",
    text: "#1f2937",
    primary: "#ff6b6b",
    border: "#f5f5f5",
};
const R = { headerH: 62, r32: 32, pad: 18 };
const CARD_COLORS = ["#FFD966", "#A5D8FF", "#B5E48C", "#F28B82", "#CDB4DB"];

export const styles = StyleSheet.create({
    vars: { colors: COLORS, radius: R },

    safe: { flex: 1, backgroundColor: COLORS.bg },

    // === Header ===
    header: {
        height: R.headerH,
        paddingHorizontal: R.pad,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        padding: 4,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerRight: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitleImg: {
        width: 100,
        height: 40,
        resizeMode: "contain",
    },

    // === Content ===
    content: { flex: 1 },

    containerCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: R.r32,
        borderTopRightRadius: R.r32,
        padding: R.pad,
        minHeight: screenHeight * 1.2,   // 기기 화면의 120% 길이
    },

    mapWrap: {
        height: "65%",
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: COLORS.border,
        position: "relative",
    },

    map: { flex: 1 },
    overlayTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: COLORS.text,
    },

    overlayCardList: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        zIndex: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    overlayTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },


    centerCard: {
        width: 140,
        height: 140,
        borderRadius: 20,
        backgroundColor: "#FFD966", // 임시 색상 (센터별 색상 주고 싶으면 랜덤/조건부로)
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    centerCardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    centerCardAddr: {
        fontSize: 13,
        color: "#666",
    },
    centerCardDist: {
        fontSize: 13,
        marginTop: 6,
        color: COLORS.primary,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },

    skeletonCard: {
        width: 140,
        height: 140,
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        marginRight: 12,
    },
    skeletonTitle: {
        width: "70%",
        height: 18,
        backgroundColor: "#E0E0E0",
        borderRadius: 6,
        marginBottom: 8,
    },
    skeletonAddr: {
        width: "50%",
        height: 14,
        backgroundColor: "#E0E0E0",
        borderRadius: 6,
    },

});
