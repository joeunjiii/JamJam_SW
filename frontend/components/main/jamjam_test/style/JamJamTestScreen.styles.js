import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#FFEFF1",
  primary: "#FF6B6B",
  text: "#222",
  card: "#FFFFFF",
  outline: "#E6E6E6",
  shadow: "rgba(0,0,0,0.08)",
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { padding: 4, paddingRight: 8 },
  headerBack: { fontSize: 22, color: COLORS.primary, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.primary },

  progressWrap: {
    paddingHorizontal: 20,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#FFD1D1",
  },
  progressFill: {
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  progressText: { width: 48, textAlign: "right", color: COLORS.text, fontWeight: "600" },

  illustrationWrap: { alignItems: "center", marginTop: 24 },
  illustration: { width: 200, height: 200, resizeMode: "contain" },

  questionWrap: { paddingHorizontal: 24, marginTop: 18 },
  questionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "700",
  },

  btnWrap: { marginTop: 24, paddingHorizontal: 20, gap: 14 },
  btn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  btnPrimary: { backgroundColor: "#E17060" },
  btnPrimaryText: { color: "white", fontSize: 16, fontWeight: "800" },
  btnGhost: { backgroundColor: "white", borderWidth: 1, borderColor: COLORS.outline },
  btnGhostText: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
});

export default styles;
