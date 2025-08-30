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
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  eyesImage: {
    width: 60,
    height: 60,
    marginBottom: 16,
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
  },
  policyCard: {
    backgroundColor: colors.white,
    borderRadius: 16, // Increased the radius for a rounder card
    marginBottom: 10, // Increased spacing between cards
    marginTop:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Increased shadow to give a lifted effect
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row", // Aligns image and text horizontally
    padding: 16,
  },
  policyImage: {
    flex: 1, // Ensures image scales based on available space
    aspectRatio: 1, // Keeps the aspect ratio of the image
    resizeMode: "contain", // Ensures the image retains its aspect ratio
    borderRadius: 15, // Rounded corners to match the design
  },
  policyTextContent: {
    flex: 1,
    marginLeft: 7, // Adjust spacing between image and text
    justifyContent: "flex-start",
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded corners for category tag
    marginBottom: 8,
  },
  categoryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  policyTitle: {
    fontSize: 18, // Larger font size for the title
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 24,
  },
  policyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
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
