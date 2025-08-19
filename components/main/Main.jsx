import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Image, ScrollView, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Feather } from "@expo/vector-icons";
import BottomTab from "./BottomTab";
import { styles, colors } from "./style/Main.style";
import MyPage from "./mypage/MyPage";
import NewsBriefCarousel from "../commonUI/NewsBriefCarousel";
export default function Main({ navigation }) {
  const userName = "수달프린스";  //목업데이터
  const [showSetupBanner, setShowSetupBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const goProfile = () => navigation.navigate("Profile");

  const dismissBanner = () => {
    setShowSetupBanner(false);
  };
  useEffect(() => {
    // 예: 프로필 완료 여부 체크 (백엔드/스토리지 연동 지점)
    (async () => {
      const done = await AsyncStorage.getItem("profile_completed"); // "true"/null
      setShowSetupBanner(done !== "true");
    })();
  }, []);

  const handleTabPress = (key) => {
    navigation.navigate(key);
  };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Image
          source={require("../../assets/main/namelogo.png")}
          style={{ width: 100, height: 40, resizeMode: "contain" }}
        />
        <Feather name="bell" size={20} color={colors.text} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 인사+말풍선 영역 전체를 relative 컨테이너로 감싼다 */}
        <View style={styles.heroArea}>
          {/* 인사 */}
          <Text style={styles.hello}>
            <Text style={{ fontWeight: "700" }}>{userName}</Text> 님   {/*목업데이터 데이터연결해야함*/}
          </Text>

          {/* 말풍선 카드 */}
          <View style={styles.chatCard}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={[styles.bubble, { width: "100%" }]} />
              <View
                style={[
                  styles.bubble,
                  {
                    width: "55%",
                    backgroundColor: colors.primaryDark,
                    marginTop: 10,
                    alignSelf: "flex-end",
                  },
                ]}
              />
            </View>
          </View>

          {/* 🔴 오버레이 배너: 말풍선 카드 위에 겹치도록 */}
          {showSetupBanner && (
            <View style={styles.overlayBanner} pointerEvents="box-none">
              <View style={styles.overlayCard}>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inlineBannerTitle}>육아 설정 해주세요</Text>
                  <Pressable
                    onPress={() => navigation.navigate("MyPage")}
                    style={styles.inlineBannerCTA}
                  >
                    <Text style={styles.inlineBannerCTAText}>프로필 설정하러 가기</Text>
                    <Feather name="chevron-right" size={18} color="#fff" />
                  </Pressable>
                </View>
                <Pressable onPress={dismissBanner} style={styles.inlineBannerClose}>
                  <Feather name="x" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* CTA 버튼들 */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <Pressable style={styles.primaryBtn} onPress={() => navigation?.navigate?.("")}>
            <Text style={styles.primaryBtnText}>잼잼이와 대화하기</Text>
            <Feather name="chevron-right" size={20} color="#fff" />
          </Pressable>

          <Pressable style={styles.outlineBtn} onPress={() => navigation?.navigate?.("PolicyCurationOnboarding")}>
            <Text style={styles.outlineBtnText}>지원정책제도 신청하기</Text>
            <Feather name="chevron-right" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* 두 개 타일 */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable style={[styles.tile, { flex: 1 }]} onPress={() => navigation?.navigate?.("JamJamTestIntro")}>
            <Image
              source={require("../../assets/main/test.png")}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
            <Text style={styles.tileTitle}>잼잼이 검사</Text>
            <Text style={styles.tileSub}>나는 어떤 부모일까?</Text>
            <Feather name="chevron-right" size={26} color={colors.text} style={{ position: "absolute", right: 12, bottom: 12 }} />
          </Pressable>

          <Pressable style={[styles.tile, { flex: 1 }]} onPress={() => navigation?.navigate?.("CommunityHomeScreen")}>
            <Image
              source={require("../../assets/main/sudal.png")}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
            <Text style={[styles.tileTitle, { color: colors.text }]}>잼잼 놀이터</Text>
            <Text style={styles.tileSub}>육아잼잼 커뮤니티</Text>
            <Feather name="chevron-right" size={26} color={colors.text} style={{ position: "absolute", right: 12, bottom: 12 }} />
          </Pressable>
        </View>

        {/* 정책 브리핑 카드 */}
        <NewsBriefCarousel intervalMs={5000} />
      </ScrollView>

      <BottomTab active={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
