import React from "react";
import { Pressable, View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

export default function SocialButton({
  variant = "kakao",
  text = "계속하기",
  onPress = () => {},
  disabled = false,
  loading = false,
}) {
  const isKakao = variant === "kakao";
  const bg = isKakao ? "#FEE500" : "#FFFFFF";
  const border = isKakao ? "transparent" : "#E6E6E6";
  const labelColor = "#222";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.baseButton,
        { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.9 : 1 },
        !isKakao && styles.withBorder,
        disabled && { opacity: 0.5 },
      ]}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Image
            source={
              isKakao
                ? require("../../assets/Login/kakao.png")
                : require("../../assets/Login/google.png")
            }
            style={[
              styles.logoImage,
              { backgroundColor: isKakao ? "#FEE500" : "#FFFFFF" }
            ]}
          />
        )}
        <Text style={[styles.label, { color: labelColor }]}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    width: "100%",
    minHeight: 48,
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
  withBorder: {
    borderWidth: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  label: { fontSize: 16, fontWeight: "700" },
});
