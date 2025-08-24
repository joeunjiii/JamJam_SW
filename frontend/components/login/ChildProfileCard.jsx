import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles, COLORS } from "./style/ChildProfileCard.styles";

const GENDER_OPTIONS = ["남", "여", "선택 안함"];

export default function ChildProfileCard({
  index,
  value,              // { id, name, birth(YYYY-MM-DD), gender }
  onChange,           // (partial: {name?, birth?, gender?}) => void
  onRemove,           // () => void
  showRemove = true,  // 첫 카드 보호하고 싶으면 false
}) {
  const [genderOpen, setGenderOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const birthDate = value.birth ? toDate(value.birth) : new Date();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>자녀 프로필{index + 1}</Text>
        {showRemove && (
          <Pressable onPress={onRemove} style={styles.removeBtn}>
            <AntDesign name="delete" size={16} color={COLORS.primary} />
          </Pressable>
        )}
      </View>

      {/* 이름 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        placeholder="이름"
        value={value.name}
        onChangeText={(t) => onChange({ name: t })}
        style={styles.inputPill}
        placeholderTextColor={COLORS.subtext}
      />

      {/* 생년월일 */}
      <Text style={styles.label}>생년월일</Text>
      <Pressable
        onPress={() => setDateOpen(true)}
        style={[styles.inputPill, styles.rowBetween]}
      >
        <Text style={styles.inputText}>
          {value.birth ? value.birth : "YYYY-MM-DD"}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={COLORS.subtext} />
      </Pressable>

      <DateTimePickerModal
        isVisible={dateOpen}
        mode="date"
        date={birthDate}
        display="spinner"
        locale="ko-KR"
        onConfirm={(d) => {
          setDateOpen(false);
          onChange({ birth: fmt(d) });
        }}
        onCancel={() => setDateOpen(false)}
      />

      {/* 성별 */}
      <Text style={styles.label}>성별</Text>
      <Pressable
        onPress={() => setGenderOpen(true)}
        style={[styles.inputPill, styles.rowBetween]}
      >
        <Text style={styles.inputText}>
          {value.gender || "예: 남 / 여"}
        </Text>
        <AntDesign name="down" size={16} color={COLORS.subtext} />
      </Pressable>

      {/* 성별 모달 */}
      <Modal transparent visible={genderOpen} animationType="fade">
        <Pressable style={styles.modalDim} onPress={() => setGenderOpen(false)}>
          <View style={styles.modalSheet}>
            {GENDER_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange({ gender: opt === "선택 안함" ? "" : opt });
                  setGenderOpen(false);
                }}
                style={[
                  styles.modalItem,
                  (value.gender || "선택 안함") === opt && { backgroundColor: COLORS.pill },
                ]}
              >
                <Text style={styles.modalText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function fmt(d) {
  const yy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function toDate(yyyy_mm_dd) {
  const [y, m, d] = yyyy_mm_dd.split("-").map((x) => parseInt(x, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}
