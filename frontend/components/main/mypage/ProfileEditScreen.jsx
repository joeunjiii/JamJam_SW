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
    Alert
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { styles } from "./style/ProfileEditScreen.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";

export default function ProfileEditScreen({ navigation }) {
    const [nickname, setNickname] = useState("");
    const [status, setStatus] = useState("출산예정");
    const [dueDate, setDueDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];
    const [gender, setGender] = useState("남성");
    const [genderOpen, setGenderOpen] = useState(false);
    const [children, setChildren] = useState([
        { id: Date.now(), name: "", birth: "", gender: "" },
    ]);
    const [profileImage, setProfileImage] = useState(null);

    // 📌 이미지 선택
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("사진 접근 권한이 필요합니다.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // 📌 DatePicker 컨트롤
    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleConfirm = (date) => {
        setDueDate(date);
        hideDatePicker();
    };

    // 📌 자녀 정보 변경
    const handleChildChange = (idx, key, value) => {
        const updated = [...children];
        updated[idx][key] = value;
        setChildren(updated);
    };

    // 📌 프로필 저장
    const handleSave = async () => {
        try {
            const profileData = {
                nickname,
                status,
                gender,
                dueDate: formatDotDate(dueDate),
                children,
            };
            await AsyncStorage.setItem("app_profile", JSON.stringify(profileData));
            Alert.alert("저장 완료", "프로필이 성공적으로 저장되었습니다.");
            navigation.goBack();
        } catch (e) {
            console.warn("프로필 저장 실패", e);
            Alert.alert("저장 실패", "다시 시도해 주세요.");
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* 헤더 */}
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
                <View style={styles.divider} />

                {/* 프로필 이미지 + 닉네임 */}
                <View style={styles.profileRow}>
                    <Pressable onPress={pickImage}>
                        <View style={styles.avatar}>
                            <Image
                                source={
                                    profileImage
                                        ? { uri: profileImage }
                                        : require("../../../assets/main/mypage/profile.png")
                                }
                                style={styles.avatarImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Pressable style={styles.avatarCamera} onPress={pickImage}>
                            <Ionicons name="add" size={16} color="#fff" />
                        </Pressable>
                    </Pressable>

                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            placeholder="닉네임"
                            value={nickname}
                            onChangeText={setNickname}
                        />
                        <Feather name="edit-2" size={16} color="#999" style={styles.icon} />
                    </View>
                </View>
                <View style={styles.divider} />

                {/* 육아 상태 */}
                <Text style={styles.label}>육아 상태를 설정해주세요</Text>
                <View style={styles.buttonGroup}>
                    {STATUS_OPTIONS.map((s) => (
                        <Pressable
                            key={s}
                            style={[styles.statusBtn, status === s && styles.statusBtnActive]}
                            onPress={() => setStatus(s)}
                        >
                            <Text
                                style={[styles.statusText, status === s && styles.statusTextActive]}
                            >
                                {s}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* 성별 선택 */}
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

                {/* 출산예정일 */}
                {["출산예정", "둘다"].includes(status) && (
                    <>
                        <Text style={styles.label}>출산예정일</Text>

                        <View style={styles.calendarWrap}>
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
                                    textMonthFontWeight: "bold",
                                    textDayFontSize: 16,
                                }}
                            />
                        </View>

                        <Text style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
                            선택된 날짜: {formatDate(dueDate)}
                        </Text>
                    </>
                )}

                {/* 자녀 프로필 */}
                {["육아 중", "둘다"].includes(status) &&
                    children.map((child, idx) => (
                        <View key={child.id ?? idx} style={styles.childCard}>
                            <Text style={styles.sectionTitle}>자녀 프로필 {idx + 1}</Text>

                            <Text style={styles.smallLabel}>이름</Text>
                            <TextInput
                                style={styles.input}
                                value={child.name}
                                placeholder="이름"
                                onChangeText={(text) => handleChildChange(idx, "name", text)}
                            />

                            <Text style={styles.smallLabel}>생년월일</Text>
                            <TextInput
                                style={styles.input}
                                value={child.birth}
                                placeholder="YYYY-MM-DD"
                                onChangeText={(text) => handleChildChange(idx, "birth", text)}
                            />

                            <Text style={styles.smallLabel}>성별</Text>
                            <TextInput
                                style={styles.input}
                                value={child.gender}
                                placeholder="남 / 여"
                                onChangeText={(text) => handleChildChange(idx, "gender", text)}
                            />
                        </View>
                    ))}

                {/* 저장 버튼 */}
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>저장하기</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

function formatDotDate(date) {
    if (!date) return "—";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
}
function formatDate(date) {
    if (!date) return "—";
    try {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}.${m}.${d}`;
    } catch (e) {
        return "—";
    }
}

function formatDateKey(date) {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  