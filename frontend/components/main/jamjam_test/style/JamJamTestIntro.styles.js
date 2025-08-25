import { StyleSheet } from "react-native";

export const COLORS = {
    bg: "#FFF6F7",
    primary: "#FF675D",
    text: "#222",
    subtext: "#000000",
    card: "#fff",
};

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },

    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50
    },
    subtitle1: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 6,
    },
    subtitle2: {
        fontSize: 14,   // 작게
        fontWeight: "400",
        color: "#666",
        marginBottom: 16,
    },
    illustration: {
        width: "100%",
        height: 220,
        resizeMode: "contain",
    },
    startBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 14,
        marginHorizontal: 40,
        marginBottom: 100,
        shadowColor: "rgba(0,0,0,0.15)",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
        bottom: 170
    },
    startText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
