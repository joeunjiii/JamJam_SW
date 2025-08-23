import { StyleSheet } from "react-native";

export const colors = {
  bg: "#FFF6F7",
  primary: "#FF6B6B",
  primaryDark: "#FF685E",
  text: "#222222",
  card: "#FFFFFF",
  outline: "#E6E6E6",
  subtle: "#F6EDEF",
  shadow: "rgba(0,0,0,0.08)",
};

export const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    height: 56,
    paddingHorizontal: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primaryDark,
    letterSpacing: 1,
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 16,
  },

  hello: { fontSize: 20, color: colors.text, marginTop: 4,marginBottom:10 },

  chatCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 12,
    minHeight: 150,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.subtle,
  },
  bubble: {
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
  },

  primaryBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  outlineBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  outlineBtnText: { color: colors.text, fontSize: 15, fontWeight: "700" },

  tileRow: { flexDirection: "row", gap: 12 },

  tile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  tileSub: { fontSize: 12, color: "#151515" },

  newsCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  newsThumb: {
    width: 96,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.subtle,
  },
  newsTagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  newsTag: { fontSize: 11, color: colors.primaryDark, fontWeight: "700" },
  newsTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  newsBody: { fontSize: 12, color: "#666", marginTop: 4 },

  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 66,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: { alignItems: "center", gap: 4 },
  tabText: { fontSize: 10, color: "#666" },
  tabActive: {},
  tabActiveText: { color: colors.primaryDark, fontWeight: "700" },
  heroArea: {
    position: "relative",    // ✅ 오버레이 기준
  },

  overlayBanner: {
    position: "absolute",
    top: 60,                 // 인사말 아래, 말풍선 카드 위에 위치
    left: 18,
    right: 18,
    zIndex: 10,              // iOS
    elevation: 10,           // Android
  },

  overlayCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    padding: 14,
    // 그림자
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  // 배너 내부 재사용 (이미 있다면 그대로 사용)
  inlineBannerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFD3D6" },
  inlineBannerTitle: { color: "#fff", fontSize: 14, fontWeight: "800", marginBottom: 8 },
  inlineBannerCTA: {
    alignSelf: "flex-start",
    backgroundColor: "#E95D58",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  inlineBannerCTAText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  inlineBannerClose: {
    position: "absolute", right: 8, top: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },

});
