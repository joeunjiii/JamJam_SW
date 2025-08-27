import { StyleSheet } from "react-native";

export const COLORS = {
    primary: "#FFE29D",
    gray500: "#A0A0A0",
    gray700: "#444",
    white: "#fff",
};

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
       
    },
    modalContainer: {
        width: "80%",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.gray700,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray500,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
});
