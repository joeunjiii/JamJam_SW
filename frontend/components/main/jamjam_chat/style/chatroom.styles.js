import { StyleSheet } from "react-native";

export const COLORS = {
    bg: "#FDE9A9", // 연노랑 배경
    primary: "#E46A6A", // 시안에서 로고 색
    grayBubble: "#D9D9D9",
    textDark: "#333",
    white: "#FFF",
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        height: 56,
        paddingHorizontal: 18,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    bgCurve: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginBottom: -100,
    },
    messageRow: {
        flexDirection: "row",
        marginVertical: 8,
    },
    myRow: {
        justifyContent: "flex-end",
    },
    otherRow: {
        justifyContent: "flex-start",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageContent: {
        maxWidth: "75%",
    },
    sender: {
        fontSize: 12,
        color: COLORS.textDark,
        marginBottom: 2,
    },
    bubble: {
        borderRadius: 16,
        padding: 10,
    },
    myBubble: {
        backgroundColor: COLORS.grayBubble,
        alignSelf: "flex-end",
    },
    otherBubble: {
        backgroundColor: COLORS.grayBubble,
        alignSelf: "flex-start",
    },
    messageText: {
        fontSize: 15,
        color: COLORS.textDark,
    },
    time: {
        fontSize: 10,
        color: "#666",
        marginTop: 4,
        alignSelf: "flex-end",
    },
    inputBar: {
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: COLORS.white,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.grayBubble,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    centerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      },
      centerMenu: {
        width: 220,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
      menuBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",   // 아이콘+텍스트를 중앙으로
        width: "100%",              // 버튼이 부모 카드 가로 전체 차지
        paddingVertical: 14,        // 높이 넉넉하게
        borderRadius: 12,
      },
      menuBtnPressed: {
        backgroundColor: "#eee", // 눌렀을 때 색 변화
      },
      menuText: {
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.textDark,
      },
      cancelBtn: {
        marginTop: 10,
        paddingVertical: 8,
      },
      
});
