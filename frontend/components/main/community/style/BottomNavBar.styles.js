// style/BottomNavBar.styles.js
import { StyleSheet } from "react-native";

export const colors = {
  primaryDark: "#FF685E",
};

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    zIndex: 100,
  },
  tab: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  activeTabHighlight: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 11,
    color: "#666",
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 2,
  },
});