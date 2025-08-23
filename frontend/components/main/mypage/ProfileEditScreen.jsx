import React, { useState } from "react";
import {
    Image,
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
    ImageBackground
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./style/ProfileEditScreen.styles";
import * as ImagePicker from "expo-image-picker";

export default function ProfileEditScreen({ navigation }) {
    const [nickname, setNickname] = useState("");
    const [status, setStatus] = useState("출산예정");
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const defaultImg = require("../../../assets/main/mypage/sudal.png");  //임시 목업이미지
    const STATUS_OPTIONS = ["출산예정", "육아 중", "해당사항 없음", "둘다"];
    const [children, setChildren] = useState([
        { name: "", birth: "", gender: "" },
    ]);

    const [profileImage, setProfileImage] = useState(null);

    const pickImage = async () => {
        // 갤러리 접근 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("사진 접근 권한이 필요합니다.");
            return;
        }

        // 갤러리에서 이미지 선택
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // 크롭 가능
            aspect: [1, 1],      // 정사각형 비율
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };
    const openDatePicker = () => {
        setShowDuePicker(true);
    };

    const handleDueDateChange = (event, selectedDate) => {
        setShowDuePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const handleChildChange = (idx, key, value) => {
        const updated = [...children];
        updated[idx][key] = value;
        setChildren(updated);
    };
    //프로필 저장 함수
    const handleSave = async () => {
        try {
            const profileData = {
                nickname,
                status,
                dueDate: formatDotDate(dueDate),
                children,
            };

            await AsyncStorage.setItem("app_profile", JSON.stringify(profileData));
            Alert.alert("✅ 저장 완료", "프로필이 성공적으로 저장되었습니다.");
            navigation.goBack();
        } catch (e) {
            console.warn("프로필 저장 실패", e);
            Alert.alert("⚠️ 저장 실패", "다시 시도해 주세요.");
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
                        <Pressable onPress={pickImage}>
                            <View style={styles.avatar}>
                                <Image
                                    source={
                                        profileImage
                                            ? { uri: profileImage }
                                            : require("../../../assets/main/mypage/profile.png") // 기본 이미지
                                    }
                                    style={styles.avatarImage}
                                    resizeMode="contain" // ✅ 비율 유지
                                />
                            </View>
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

                {/* 육아 상태 버튼 그룹 */}
                <Text style={styles.label}>육아 상태를 설정해주세요</Text>
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

                {/* 출산예정일 */}
                {["출산예정", "둘다"].includes(status) && (
                    <>
                        <Text style={styles.label}>출산예정일</Text>
                        <Pressable onPress={openDatePicker} style={styles.dateField}>
                            <Text>{formatDate(dueDate)}</Text>
                            <Feather name="calendar" />
                        </Pressable>
                    </>
                )}

                {/* 자녀 프로필 */}
                {["육아 중", "둘다"].includes(status) &&
                    children.map((child, idx) => (
                        <View key={child.id || idx} style={styles.childCard}>
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