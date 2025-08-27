import React, { useState } from "react";
import {
    Image,
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
    Modal,
    Alert,
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { styles } from "./style/ProfileEditScreen.styles";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import ProfileService from "../../login/service/ProfileService";
import { storage } from "../../login/service/storage";

const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];

export default function ProfileEditScreen({ navigation, route }) {
    const existing = route.params?.profile || {};

    // === 상태값 초기화 (기존 값 있으면 로드) ===
    const [nickname, setNickname] = useState(existing.nickname || "");
    const [status, setStatus] = useState(existing.status || "출산예정");
    const [gender, setGender] = useState(existing.gender || "남성");
    const [dueDate, setDueDate] = useState(
        existing.dueDate ? new Date(existing.dueDate) : new Date()
    );
    const [children, setChildren] = useState(existing.children || []);
    const [profileImage, setProfileImage] = useState(existing.profileImageUrl || null);

    // 모달 상태
    const [genderOpen, setGenderOpen] = useState(false);

    /* ---------------- 이미지 선택 ---------------- */
    const pickImage = async () => {
        const { status: granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted !== "granted") {
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

    /* ---------------- 자녀 관리 ---------------- */
    const handleChildChange = (idx, key, value) => {
        setChildren((prev) =>
            prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
        );
    };
    const addChild = () => {
        setChildren([...children, { id: Date.now(), name: "", birth: "", gender: "" }]);
    };
    const removeChild = (idx) => {
        setChildren(children.filter((_, i) => i !== idx));
    };

    /* ---------------- 저장 ---------------- */
    const handleSave = async () => {
        try {
            const userId = await storage.getItem("userId");
            if (!userId) throw new Error("로그인이 필요합니다.");

            const payload = {
                nickname,
                gender,
                status,
                dueDate,
                children,
                profileImageUrl: profileImage,
            };

            await ProfileService.saveProfile(userId, payload);

            Alert.alert("성공", "프로필이 저장되었습니다.", [
                { text: "확인", onPress: () => navigation.goBack() },
            ]);
        } catch (e) {
            console.error("저장 실패:", e);
            Alert.alert("오류", e.message || "저장 실패");
        }
    };

    /* ---------------- 화면 ---------------- */
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={26} color="#FF6B6B" />
                    </Pressable>
                    <Image
                        source={require("../../../assets/main/namelogo.png")}
                        style={{ width: 100, height: 40, resizeMode: "contain" }}
                    />
                    <Feather name="bell" size={20} />
                </View>

                {/* 프로필 */}
                <View style={styles.profileRow}>
                    <Pressable onPress={pickImage}>
                        <Image
                            source={
                                profileImage
                                    ? { uri: profileImage }
                                    : require("../../../assets/main/mypage/profile.png")
                            }
                            style={styles.avatarImage}
                        />
                    </Pressable>
                    <TextInput
                        style={styles.input}
                        placeholder="닉네임"
                        value={nickname}
                        onChangeText={setNickname}
                    />
                </View>

                {/* 성별 */}
                <Text style={styles.label}>성별</Text>
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
                    <AntDesign name="down" size={16} color="#333" />
                </Pressable>

                {/* 성별 모달 */}
                <Modal transparent visible={genderOpen} animationType="fade">
                    <Pressable style={styles.modalDim} onPress={() => setGenderOpen(false)}>
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
                                        gender === opt && { backgroundColor: "#FFEDEF" },
                                    ]}
                                >
                                    <Text style={styles.modalText}>{opt}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>

                {/* 육아 상태 */}
                <Text style={styles.label}>육아 상태</Text>
                <View style={styles.buttonGroup}>
                    {STATUS_OPTIONS.map((s) => (
                        <Pressable
                            key={s}
                            style={[styles.statusBtn, status === s && styles.statusBtnActive]}
                            onPress={() => setStatus(s)}
                        >
                            <Text style={[styles.statusText, status === s && styles.statusTextActive]}>
                                {s}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* 출산 예정일 */}
                {["출산예정", "둘다"].includes(status) && (
                    <>
                        <Text style={styles.label}>출산 예정일</Text>
                        <Calendar
                            onDayPress={(day) => setDueDate(new Date(day.dateString))}
                            markedDates={{
                                [formatDateKey(dueDate)]: {
                                    selected: true,
                                    selectedColor: "#FF6B6B",
                                },
                            }}
                            theme={{
                                todayTextColor: "#FF6B6B",
                                arrowColor: "#FF6B6B",
                                monthTextColor: "#333",
                            }}
                        />
                        <Text style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
                            선택된 날짜: {formatDate(dueDate)}
                        </Text>
                    </>
                )}

                {/* 자녀 */}
                {["육아 중", "둘다"].includes(status) && (
                    <>
                        <Text style={styles.label}>자녀 정보</Text>
                        {children.map((child, idx) => (
                            <View key={child.id ?? idx} style={styles.childCard}>
                                <Text style={styles.sectionTitle}>자녀 {idx + 1}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={child.name}
                                    placeholder="이름"
                                    onChangeText={(text) => handleChildChange(idx, "name", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={child.birth}
                                    placeholder="YYYY-MM-DD"
                                    onChangeText={(text) => handleChildChange(idx, "birth", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={child.gender}
                                    placeholder="남 / 여"
                                    onChangeText={(text) => handleChildChange(idx, "gender", text)}
                                />
                                {children.length > 1 && (
                                    <Pressable onPress={() => removeChild(idx)} style={styles.removeBtn}>
                                        <Text style={styles.removeText}>삭제</Text>
                                    </Pressable>
                                )}
                            </View>
                        ))}
                        <Pressable onPress={addChild} style={styles.addBtn}>
                            <Text style={styles.addText}>+ 자녀 추가</Text>
                        </Pressable>
                    </>
                )}

                {/* 저장 */}
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>저장하기</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

/* === 날짜 포맷 유틸 === */
function formatDate(date) {
    if (!date) return "—";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
}
function formatDateKey(date) {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
