import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Modal } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const colors = {
  primaryDark: "#FF685E",
};

export default function BottomTab({ onTabPress }) {
  const route = useRoute();
  const currentRoute = route.name;

  const [showModal, setShowModal] = useState(false);

  const tabs = [
    {
      key: "Roadmap",
      label: "출산로드맵",
      icon: (
        <Image
          source={require("../../assets/main/roadmap.png")}
          style={{ width: 25, height: 25, resizeMode: "contain" }}
        />
      ),
    },
    {
      key: "Chat",
      label: "잼잼톡",
      icon: <Ionicons name="chatbubble-ellipses" size={25} color="#FF685E" />,
    },
    {
      key: "Main",
      label: "홈",
      icon: <Feather name="home" size={25} color="#fff" />,
    },
    {
      key: "Center",
      label: "센터 찾기",
      icon: <Feather name="map-pin" size={20} color="#FF685E" />,
    },
    {
      key: "MyPage",
      label: "마이페이지",
      icon: <Feather name="user" size={20} color="#FF685E" />,
    },
  ];

  return (
    <>
      <View style={styles.tabbar}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (tab.key === "Roadmap") {
                  setShowModal(true);
                } else {
                  onTabPress(tab.key);
                }
              }}
            >
              {isActive && tab.key === "Main" ? (
                <View style={styles.homeWrapper}>
                  {tab.icon}
                  <Text style={styles.homeText}>{tab.label}</Text>
                </View>
              ) : (
                <View style={[styles.tabItem, isActive && styles.tabItemActive]}>
                  {tab.icon}
                  <Text
                    style={[styles.tabText, isActive && styles.tabActiveText]}
                  >
                    {tab.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* 📌 모달 */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalDim}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>출산 로드맵</Text>
            <Text style={styles.modalMsg}>해당 기능은 추후 개발 예정입니다 🙂</Text>
            <Pressable style={styles.modalBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.modalBtnText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabbar: {
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
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: "#FFF1F0",
  },
  tabText: {
    fontSize: 11,
    color: "#666",
  },
  tabActiveText: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  homeWrapper: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  homeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  // 📌 Modal 스타일
  modalDim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "70%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  modalMsg: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
