import { Dimensions, StyleSheet } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export const COLORS = {
    bg: "#FFB3BA",
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
    card: {
        width: 220,
        marginRight: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text },
    cardAddr: { fontSize: 12, color: "#555", marginTop: 4 },
    cardDist: { fontSize: 12, color: COLORS.primary },

});
