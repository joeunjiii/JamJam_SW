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
    dropdownBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        marginBottom: 12,
    },
    dropdownText: {
        fontSize: 15,
        color: "#333",
        fontWeight: "500",
    },
    dropdownList: {
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E6E6E6",
        marginBottom: 16,
        overflow: "hidden",
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
    },
    dropdownItemText: {
        fontSize: 14,
        color: "#444",
    },

    inputTitle: {
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 12,
    },
    inputContent: {
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        minHeight: 160,
        textAlignVertical: "top",
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",     // ✅ 바텀시트가 아래 붙도록
        backgroundColor: "rgba(0,0,0,0.4)", // 반투명 배경
      },
      bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "60%",
      },
      dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginBottom: 12,
      },
      modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
      },
      modalItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2",
      },
      modalItemText: {
        fontSize: 15,
        textAlign: "center",
        color: "#333",
      },
      modalCancel: {
        marginTop: 12,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
      },
      modalCancelText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#666",
      },
      

});
