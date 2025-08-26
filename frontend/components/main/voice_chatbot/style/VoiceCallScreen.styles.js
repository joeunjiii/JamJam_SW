import { Dimensions, StyleSheet } from "react-native";

export const Colors = {
  bg: "#FFEDE4",
  surface: "#FFFFFF",
  primary: "#FF685E",
  primaryDark: "#E65552",
  text: "#222222",
  subtext: "#8A8A8A",
  outline: "#EDE8EA",
  pillBg: "#FFE1E3",
  positive: "#00C48C",
  warning: "#FFC857",
};

const { width, height } = Dimensions.get("window");

export const style = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  // top
  topWrap: {
    alignItems: "center",
    marginTop: height * 0.05,
    gap: 12,
  },

  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 50
  },

  timeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  nameText: {
    fontSize: 28,
    fontWeight: "800",
    color: "Colors.text",
    letterSpacing: -0.1,
    textAlign: "center",
  },
  // avatar
  avatarWrap: {
    flex: 1, // 남는 공간 다 차지
    justifyContent: "center", // 세로 중앙
    alignItems: "center",     // 가로 중앙
    marginTop: -height * 0.3,
  },
  avatarOuter: {
    width: Math.min(width * 1, height * 0.45),
    height: Math.min(width * 1, height * 0.35),
    borderRadius: 10, // 원형으로 하고 싶으면 반으로
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatarGlow: { // speaking/recording 상태에 따라 테두리 강조
    position: "absolute",
    width: 260, height: 260, borderRadius: 130,
    borderWidth: 2, borderColor: Colors.primary, opacity: 0.35,
  },
  avatar: { width: 200, height: 200, borderRadius: 100, backgroundColor: "#FFF" },

  // close ghost
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  captionWrap: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "85%",
  },

  captionText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: 800
  },
  bgCurve: {
    position: "absolute",
    bottom: 0,            // 👈 항상 하단 고정
    left: 0,
    right: 0,
    height: height * 0.28,  // 👈 기기 높이의 25% 차지
    backgroundColor: "#FFF1F6",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    alignItems: "center",
  },

  bottomInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",

  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 24,
  },
  exiticon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 32,
    marginTop: 16
  },
  iconLabel: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: "600",
    textAlign: "center",
  },
  // bottom bar
  bottom: {
    position: "absolute", left: 0, right: 0, bottom: 24,
    paddingHorizontal: 16, alignItems: "center",
  },

  secBtn: {
    width: 54,
    height: 54,
    borderRadius: 45,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  // states
  recBorder: { borderColor: Colors.primary, borderWidth: 2 },
  speakBorder: { borderColor: Colors.positive, borderWidth: 2 },
});
