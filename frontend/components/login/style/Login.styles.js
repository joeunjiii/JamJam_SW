// components/Login.styles.js
import { StyleSheet } from "react-native";

export const colors = {
  bg: "#FFF6F7",
  primary: "#FF6B6B",
  brown: "#FF685E",
  kakao: "#FEE500",
  google: "#FFFFFF",
  text: "#222222",
};

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  centerBox: { alignItems: "center" },
  tagline: { fontSize: 14, marginBottom: 3, fontWeight: 800 },
  logo: { fontSize: 40, fontWeight: "800", marginBottom: 12 },
  illo: { width: 180, height: 180, resizeMode: "contain" },
  buttonGroup: { width: "100%" },
  help: { fontSize: 12, color: "#9E9E9E", textAlign: "center" },


  baseButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, },
  iconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconDotText: { color: "#fff", fontSize: 12, lineHeight: 12 },
  buttonLabel: { fontSize: 16, fontWeight: "700", color: "#222" },
});
