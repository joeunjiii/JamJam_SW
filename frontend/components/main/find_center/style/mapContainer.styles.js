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
    },

    map: { flex: 1 },

    overlayCardList: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        zIndex: 10,
        elevation: 10,
    },
    centerCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginRight: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        width: 200,
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
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },
});
