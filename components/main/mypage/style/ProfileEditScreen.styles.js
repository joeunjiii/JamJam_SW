import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#FFF6F7",
  primary: "#FF6B6B",
  text: "#222222",
  subtext: "#777777",
  border: "#E6E6E6",
  card: "#FFFFFF",
  pillBg: "#F3F4F6",
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  // 헤더
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap:30
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eee",
  },

  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginLeft: 6,
  },

  // 라벨
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E6E6", // 연한 회색
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  // 상태 버튼
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusBtn: {
    width: "20%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 8,
    marginBottom: 8,
  },
  statusBtnActive: {
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  statusTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // 출산 예정일
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  // 자녀 카드
  childCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
  },
  smallLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 10,
    marginBottom: 4,
  },

  // 저장 버튼
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
