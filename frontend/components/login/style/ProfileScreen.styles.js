import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#FFF6F7",
  primary: "#FF685E",
  text: "#333",
  subtext: "#888",
  card: "#FFFFFF",
  pill: "#FFFFFF",
  border: "#E9E9EE",
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  headerCenter: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  saveBtn: { width: 40, alignItems: "flex-end" },
  saveText: { color: COLORS.primary, fontWeight: "700", fontSize: 20 },

  container: { paddingHorizontal: 16, paddingBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
    marginBottom: 12,
  },

  profileRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  sectionLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  hint: { fontSize: 12, color: COLORS.subtext, fontWeight: "500" },

  label: {
    marginTop: 10,
    marginBottom: 6,
    color: COLORS.subtext,
    fontSize: 12,
    fontWeight: "600",
  },

  inputPill: {
    backgroundColor: COLORS.pill,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputText: { color: COLORS.text, fontSize: 14 },

  selectPill: {
    borderRadius: 999,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { color: COLORS.text, fontSize: 14 },

  modalDim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  modalText: { fontSize: 16, color: COLORS.text },

  childHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  childCard: {
    backgroundColor: "#FFF8F8",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFE1E3",
  },
  childTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
});
