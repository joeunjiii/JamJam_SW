import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#FF685E",
  text: "#333",
  subtext: "#888",
  pill: "#F3F4F6",
  border: "#E9E9EE",
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF8F8",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFE1E3",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

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

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  modalDim: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: 10 },
  modalText: { fontSize: 16, color: COLORS.text },
});
