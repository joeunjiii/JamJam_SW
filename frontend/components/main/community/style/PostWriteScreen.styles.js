import { StyleSheet } from "react-native";

export const COLORS = {
    primary: "#FF675D",
    text: "#222",
    border: "#E5E5E5",
    placeholder: "#999",
    bg: "#fff",
};

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text,
    },
    submitBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    form: {
        padding: 16,
    },
    dropdownBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#fafafa",
    },
    dropdownText: {
        fontSize: 14,
        color: COLORS.text,
    },
    inputTitle: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        fontSize: 16,
        paddingVertical: 10,
        marginBottom: 16,
    },
    inputContent: {
        height: 250,
        fontSize: 15,
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
    },
    dropdownList: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemText: {
        fontSize: 14,
        color: "#333",
    },


});