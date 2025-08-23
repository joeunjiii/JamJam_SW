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
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { styles, COLORS } from "./style/ProfileScreen.styles";
import ChildProfileCard from "./ChildProfileCard";

const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];

export default function ProfileScreen() {
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("출산예정");
  const [statusOpen, setStatusOpen] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDuePicker, setShowDuePicker] = useState(false);
  const navigation = useNavigation();
  const [children, setChildren] = useState([
    { id: 1, name: "", birth: "", gender: "" },
  ]);

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

  const showChildSection =
    status === "육아 중" || status === "둘다"; // 상태에 따라 자녀 정보 표시
  const showDueDate = status === "출산예정" || status === "둘다";

  const saveProfile = () => {
    const payload = {
      nickname,
      status,
      dueDate: showDueDate ? dueDate : null,
      children: showChildSection ? children : [],
    };
    console.log("SAVE", payload); // TODO: 서버 전송
    navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {/* 가운데 로고 (absolute 배치) */}
        <View style={styles.headerCenter}>
          <Image
            source={require("../../assets/main/namelogo.png")}
            style={{ width: 100, height: 40, resizeMode: "contain" }}
          />
        </View>

        {/* 오른쪽 저장 버튼 */}
        <Pressable onPress={saveProfile} style={styles.saveBtn} hitSlop={8}>
          <Text style={styles.saveText}>저장</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>프로필 입력하기</Text>

        {/* 프로필 아바타 + 닉네임 */}
        <View style={styles.profileRow}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
              style={styles.inputPill}
              placeholderTextColor={COLORS.subtext}
            />
          </View>
        </View>

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
          <Text style={styles.selectText}>
            {status} | 육아 중 | 해당사항 없음 | 둘다
          </Text>
          <AntDesign name="down" size={16} color={COLORS.text} />
        </Pressable>

        {/* 상태 선택 모달 */}
        <Modal transparent visible={statusOpen} animationType="fade">
          <Pressable style={styles.modalDim} onPress={() => setStatusOpen(false)}>
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
              <Text style={styles.inputText}>{formatDate(dueDate)}</Text>
              <Ionicons name="calendar-outline" size={18} color={COLORS.subtext} />
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
              // 아래 옵션으로 플랫폼별 표시 형태/로케일 통일
              display={Platform.select({ ios: "spinner", android: "calendar" })}
              locale="ko-KR"
            // 선택 범위 제한이 필요하면 추가
            // minimumDate={new Date()} 
            // maximumDate={new Date(2030, 11, 31)}
            />
          </>
        )}


        {showChildSection && (
          <>
            <View style={styles.childHeaderRow}>
              <Text style={styles.sectionLabel}>
                자녀 정보
              </Text>
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


        <View style={{ height: 40 }} />
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

