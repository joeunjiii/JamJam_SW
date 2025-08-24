import { StyleSheet } from "react-native";

export const COLORS = {
    bg: "#FFF6F7",
    primary: "#FF6B6B",
    text: "#222",
    subtext: "#FF675D",
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
    },
    illustration: {
        width: 250,
        height: 250,
        resizeMode: "contain",
        marginBottom: 0,
    },
    subtitle: {
        marginTop: 0,     // ✅ 혹시 여백 있으면 없애기
        marginBottom: 0,  // ✅ title과도 붙이고 싶으면
        fontSize: 18,
        color: COLORS.subtext,
        fontWeight: "800",
        top:40
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
        bottom:170
    },
    startText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
