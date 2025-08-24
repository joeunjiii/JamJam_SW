import { StyleSheet, Platform } from "react-native";



export const COLORS = {
  bg: "#FFF6F7",
  primary: "#FF6B6B",
  text: "#222",
  subtext: "#666",
  card: "#FFF",
  border: "#EEE",
};

export const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
  },
  headerLeft: { width: 40, height: 40, justifyContent: "center" },
  logo: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  introCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  introText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  questionBlock: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },


  questionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },


  // 말풍선
  chatBubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F1F5",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "80%",
  },
  chatBubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "80%",
  },chatText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    fontWeight:800
  },
  chatTextRight: {
    fontSize: 18,
    color: "#FFF",
    fontWeight:800
  },
  // 옵션 버튼
  optionsGroup: { marginTop: 8 },
  optionBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  optionBtnSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFEFF1",
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight:500
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },


  // 다음 버튼
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  nextText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  // 분석 오버레이
  analysisOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingBottom:350
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  analysisBox: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  analysisEyes: { width: 80, height: 80, marginBottom: 20 },
  analysisTitle: { fontSize: 18, textAlign: "center", marginBottom: 6,fontWeight:800},
  analysisHighlight: { color: COLORS.primary, fontWeight: "800" },
  analysisSub: { fontSize: 16, color: COLORS.subtext },
});
