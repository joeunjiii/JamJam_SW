import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { styles, COLORS } from "./style/ProfileScreen.styles";
import ChildProfileCard from "./ChildProfileCard";
import * as ImagePicker from "expo-image-picker";
import ProfileService from "./service/ProfileService";
import { storage } from "./service/storage";

const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();

  // ✅ userId 상태로 관리
  const [userId, setUserId] = useState(null);
  const isEdit = route?.params?.isEdit || false;

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // 프로필 상태들
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("출산예정");
  const [statusOpen, setStatusOpen] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [gender, setGender] = useState("남성");
  const [genderOpen, setGenderOpen] = useState(false);
  const [children, setChildren] = useState([
    { id: 1, name: "", birth: "", gender: "" },
  ]);

  const showChildSection = status === "육아 중" || status === "둘다";
  const showDueDate = status === "출산예정" || status === "둘다";

  // ✅ userId 로드 (route.params → 없으면 storage)
  useEffect(() => {
    (async () => {
      if (route?.params?.userId) {
        setUserId(route.params.userId);
      } else {
        const storedId = await storage.getItem("userId");
        setUserId(storedId);
      }
    })();
  }, [route?.params?.userId]);

  // ✅ userId 준비되면 기존 프로필 불러오기 (수정 모드일 때만)
  useEffect(() => {
    if (isEdit && userId) {
      loadExistingProfile();
    }
  }, [isEdit, userId]);

  /**
   * 기존 프로필 데이터 로드
   */
  const loadExistingProfile = async () => {
    try {
      setInitialLoading(true);
      const profileData = await ProfileService.getProfile(userId);
      const convertedData = ProfileService.convertFromApiFormat(profileData);

      // 상태 업데이트
      setNickname(convertedData.nickname);
      setGender(convertedData.gender);
      setStatus(convertedData.status);
      setDueDate(convertedData.dueDate || new Date());
      setProfileImage(convertedData.profileImageUrl);

      if (convertedData.children && convertedData.children.length > 0) {
        setChildren(convertedData.children);
      }
    } catch (error) {
      console.error("프로필 로드 실패:", error);
      Alert.alert("오류", "프로필 정보를 불러올 수 없습니다.");
    } finally {
      setInitialLoading(false);
    }
  };

  const onAddChild = () => {
    setChildren((prev) => [
      ...prev,
      { id: Date.now(), name: "", birth: "", gender: "" },
    ]);
  };

  const onChangeChild = (id, key, value) => {
    setChildren((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  /**
   * ✅ 프로필 저장 (생성/수정 통합) - isEdit 플래그 전달
   */
  const saveProfile = async () => {
    if (!userId) {
      Alert.alert("오류", "사용자 ID를 찾을 수 없습니다.");
      return;
    }

    // 유효성 검사
    if (!nickname.trim()) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }

    // 자녀 정보 유효성 검사
    if (showChildSection) {
      const validChildren = children.filter(
          (child) => child.name.trim() && child.birth
      );
      if (validChildren.length === 0) {
        Alert.alert("알림", "자녀 정보를 입력해주세요.");
        return;
      }
    }

    const payload = {
      nickname: nickname.trim(),
      gender,
      status,
      dueDate: showDueDate ? dueDate : null,
      children: showChildSection
          ? children.filter((child) => child.name.trim() && child.birth)
          : [],
      profileImageUrl: profileImage,
    };

    console.log("=== saveProfile 디버깅 ===");
    console.log("현재 status 값:", status);
    console.log("showDueDate:", showDueDate);
    console.log("payload 전체:", payload);

    try {
      setLoading(true);
      console.log(`프로필 ${isEdit ? '수정' : '생성'} 시작 - userId: ${userId}, isEdit: ${isEdit}`);

      // ✅ isEdit 플래그를 ProfileService에 전달
      const savedProfile = await ProfileService.saveProfile(userId, payload, isEdit);
      console.log("프로필 저장 성공:", savedProfile);

      // 저장 후 Main → MyPage 탭으로 이동
      navigation.replace("Main", { initialTab: "MyPage", userId });
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      Alert.alert("오류", error.message || "프로필 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 초기 로딩 중
  if (initialLoading || !userId) {
    return (
        <SafeAreaView style={styles.safe}>
          <View
              style={[
                styles.container,
                { justifyContent: "center", alignItems: "center" },
              ]}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 16, color: COLORS.text }}>
              프로필을 불러오는 중...
            </Text>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Image
                source={require("../../assets/main/namelogo.png")}
                style={{ width: 100, height: 40, resizeMode: "contain" }}
            />
          </View>
          <Pressable
              style={[styles.saveBtn, loading && { opacity: 0.6 }]}
              onPress={saveProfile}
              disabled={loading}
          >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.saveText}>저장</Text>
            )}
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {isEdit ? "프로필 수정하기" : "프로필 입력하기"}
          </Text>

          {/* 프로필 아바타 + 닉네임 */}
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Pressable onPress={pickImage} style={styles.avatar}>
                <Image
                    source={
                      profileImage
                          ? { uri: profileImage }
                          : require("../../assets/main/mypage/profile.png")
                    }
                    style={styles.avatarImage}
                />
              </Pressable>
              <Pressable style={styles.avatarCamera} onPress={pickImage}>
                <Ionicons name="add" size={16} color="#fff" />
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>닉네임</Text>
              <View style={styles.inputRow}>
                <Ionicons
                    name="person-outline"
                    size={16}
                    color={COLORS.subtext}
                    style={{ marginRight: 6 }}
                />
                <TextInput
                    placeholder="닉네임"
                    value={nickname}
                    onChangeText={setNickname}
                    style={styles.inputFlex}
                    placeholderTextColor={COLORS.subtext}
                    maxLength={50}
                />
              </View>
            </View>
          </View>

          {/* 성별 선택 */}
          <Text style={styles.sectionLabel}>성별을 선택해주세요</Text>
          <Pressable
              onPress={() => setGenderOpen(true)}
              style={[styles.selectPill, styles.rowBetween]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                  name={gender === "남성" ? "male-outline" : "female-outline"}
                  size={18}
                  color={gender === "남성" ? "#3B82F6" : "#EC4899"}
                  style={{ marginRight: 6 }}
              />
              <Text style={styles.selectText}>{gender}</Text>
            </View>
            <AntDesign name="down" size={16} color={COLORS.text} />
          </Pressable>

          <Modal transparent visible={genderOpen} animationType="fade">
            <Pressable
                style={styles.modalDim}
                onPress={() => setGenderOpen(false)}
            >
              <View style={styles.modalSheet}>
                {["남성", "여성"].map((opt) => (
                    <Pressable
                        key={opt}
                        onPress={() => {
                          setGender(opt);
                          setGenderOpen(false);
                        }}
                        style={[
                          styles.modalItem,
                          gender === opt && { backgroundColor: COLORS.pill },
                        ]}
                    >
                      <Text style={styles.modalText}>{opt}</Text>
                    </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>

          {/* 육아 상태 */}
          <Text style={styles.sectionLabel}>
            육아 상태를 설정해주세요
            <Text style={styles.hint}>
              {" "}
              (육아 상태에 따라 아래 필요정보가 바뀝니다)
            </Text>
          </Text>
          <Pressable
              onPress={() => setStatusOpen(true)}
              style={[styles.selectPill, styles.rowBetween]}
          >
            <Text style={styles.selectText}>{status}</Text>
            <AntDesign name="down" size={16} color={COLORS.text} />
          </Pressable>

          <Modal transparent visible={statusOpen} animationType="fade">
            <Pressable
                style={styles.modalDim}
                onPress={() => setStatusOpen(false)}
            >
              <View style={styles.modalSheet}>
                {STATUS_OPTIONS.map((opt) => (
                    <Pressable
                        key={opt}
                        onPress={() => {
                          setStatus(opt);
                          setStatusOpen(false);
                        }}
                        style={[
                          styles.modalItem,
                          status === opt && { backgroundColor: COLORS.pill },
                        ]}
                    >
                      <Text style={styles.modalText}>{opt}</Text>
                    </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>

          {/* 출산 예정일 */}
          {showDueDate && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
                  출산예정일을 선택해주세요
                </Text>
                <Pressable
                    onPress={() => setShowDuePicker(true)}
                    style={[styles.inputPill, styles.rowBetween]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={COLORS.subtext}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.inputText}>{formatDate(dueDate)}</Text>
                  </View>
                </Pressable>

                <DateTimePickerModal
                    isVisible={showDuePicker}
                    mode="date"
                    date={dueDate}
                    onConfirm={(d) => {
                      setDueDate(d);
                      setShowDuePicker(false);
                    }}
                    onCancel={() => setShowDuePicker(false)}
                    display={Platform.select({
                      ios: "spinner",
                      android: "calendar",
                    })}
                    locale="ko-KR"
                />
              </>
          )}

          {/* 자녀 정보 */}
          {showChildSection && (
              <>
                <View style={styles.childHeaderRow}>
                  <Text style={styles.sectionLabel}>자녀 정보</Text>
                  <Pressable onPress={onAddChild} style={styles.addBtn}>
                    <AntDesign name="plus" size={16} color={COLORS.primary} />
                  </Pressable>
                </View>
                {children.map((c, idx) => (
                    <ChildProfileCard
                        key={c.id}
                        index={idx}
                        value={c}
                        showRemove={children.length > 1}
                        onChange={(partial) =>
                            onChangeChild(
                                c.id,
                                Object.keys(partial)[0],
                                Object.values(partial)[0]
                            )
                        }
                        onRemove={() =>
                            setChildren((prev) => prev.filter((x) => x.id !== c.id))
                        }
                    />
                ))}
              </>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
  );
}

function formatDate(d) {
  const yy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}