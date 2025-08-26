import React from "react";
import { View, Text, Image, Pressable, SafeAreaView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/JamJamTestIntro.styles";

export default function JamJamTestIntro({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>

            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>
                <Image
                    source={require("../../../assets/main/namelogo.png")}
                    style={{ width: 100, height: 40, resizeMode: "contain" }}
                />
                <Feather name="bell" size={20} color={COLORS.text} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.subtitle1}>육아 성향 태도 테스트</Text>
                <Text style={styles.subtitle2}>부모로서의 나는 어떤 모습일까?</Text>
                <Image
                    source={require("../../../assets/main/jamjam_test/jamjamintro.png")}
                    style={styles.illustration}
                />
            </View>

            {/* CTA Button */}
            <Pressable
                style={styles.startBtn}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "JamJamTestScreen" }],
                    })
                }
            >
                <Text style={styles.startText}>시작하기</Text>
            </Pressable>
        </SafeAreaView>
    );
}
