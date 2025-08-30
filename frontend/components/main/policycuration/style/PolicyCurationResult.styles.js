import { StyleSheet } from "react-native";

export const colors = {
  primary: "#FF6B6B",
  text: "#333333",
  textSecondary: "#666666",
  background: "#F8F9FA",
  white: "#FFFFFF",
  border: "#E5E5E5"
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF1F6",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  resultHeader: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: colors.white,
    
  },
  eyesImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: "contain",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  highlightText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  policiesContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    marginTop:10
  },
  policyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  policyContent: {
    flexDirection: "column",
    padding: 16,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  policyImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    resizeMode: "cover",
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 22,
  },
  policyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  detailButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
