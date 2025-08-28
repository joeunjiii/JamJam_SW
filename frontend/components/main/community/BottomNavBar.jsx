import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { styles } from "./style/BottomNavBar.styles";
export default function BottomNavBar({ active = "home", onTabPress }) {
  return (
      <View style={styles.container}>
        {TABS.map((tab) => (
            <Pressable
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                style={[
                  styles.tab,
                  active === tab.key && tab.key === "home" && styles.activeTabHighlight,
                ]}
            >
              {tab.icon(active === tab.key)}
              <Text style={[styles.label, active === tab.key && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
        ))}
      </View>
  );
}

const TABS = [
  {
    key: "search",
    label: "검색",
    icon: (focused) => (
        <Ionicons name="search" size={20} color={focused ? "#fff" : "#FF675D"} />
    ),
  },
  {
    key: "addFriend",
    label: "친구추가",
    icon: (focused) => (
        <Ionicons name="person-add" size={20} color={focused ? "#fff" : "#FF675D"} />
    ),
  },
  {
    key: "home", // ← 중앙
    label: "홈",
    icon: (focused) => (
        <Feather name="home" size={25} color={focused ? "#fff" : "#FF675D"} />
    ),
  },
  {
    key: "chat",
    label: "잼잼톡",
    icon: (focused) => (
        <Ionicons name="chatbubble-ellipses" size={20} color={focused ? "#fff" : "#FF675D"} />
    ),
  },
  {
    key: "write",
    label: "작성하기",
    icon: (focused) => (
        <Feather name="edit-2" size={20} color={focused ? "#fff" : "#FF675D"} />
    ),
  },
];

