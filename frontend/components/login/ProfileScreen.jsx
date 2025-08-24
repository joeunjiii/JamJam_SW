import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { styles, COLORS } from "./style/ProfileScreen.styles";
import ChildProfileCard from "./ChildProfileCard";
import * as ImagePicker from "expo-image-picker";
const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];

export default function ProfileScreen() {
  const navigation = useNavigation();

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

  const saveProfile = () => {
    const payload = {
      nickname,
      gender,
      status,
      dueDate: showDueDate ? dueDate : null,
      children: showChildSection ? children : [],
    };
    console.log("SAVE", payload);
    navigation.navigate("Main");
  };

  const pickImage = async () => {
    // 권한 요청 (iOS/Android)
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }

    // 이미지 선택
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,   // 편집(자르기) 가능
      aspect: [1, 1],        // 정사각형 비율
      quality: 0.8,          // 화질 (0~1)
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };


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
        {/* Header */}
        <View style={styles.header}>
          {/* 오른쪽 저장 버튼 */}
          <Pressable style={styles.saveBtn} onPress={saveProfile}>
            <Text style={styles.saveText}>저장</Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>프로필 입력하기</Text>

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
              color={gender === "남성" ? "#3B82F6" : "#EC4899"} // 남: 파랑, 여: 핑크
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
              display={Platform.select({ ios: "spinner", android: "calendar" })}
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
