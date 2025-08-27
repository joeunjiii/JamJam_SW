import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    SafeAreaView,
    FlatList,
    Image,
    Alert,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal"; // ✅ react-native-modal 사용
import { styles } from "./style/PostWriteScreen.styles";
import { createPost, uploadMedia } from "./service/communityService";

const BOARD_OPTIONS = [
    { key: "all", label: "전체글" },
    { key: "free", label: "자유게시판" },
    { key: "qa", label: "QA" },
    { key: "notice", label: "공지사항" },
];

export default function PostWriteScreen({ navigation }) {
    const [board, setBoard] = useState("게시판 선택");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState([]);

    // 🔑 모달 트리거 버튼 ref
    const dropdownRef = useRef(null);

    // 이미지 선택
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets.map((a) => a.uri)]);
        }
    };

    // 글 등록
    const handleSubmit = async () => {
        try {
            const uploadedUrls = [];
            for (let img of images) {
                const url = await uploadMedia(img);
                uploadedUrls.push(url);
            }

            const newPost = await createPost({
                authorId: 1, // TODO: 로그인 유저 ID 적용
                board: board === "게시판 선택" ? "free" : board,
                title,
                body: content,
                mediaUrls: uploadedUrls,
            });

            Alert.alert("✅ 등록 성공", `게시글 ID: ${newPost.postId}`);
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert("❌ 오류", "게시글 등록 실패");
        }
    };

    // 🔑 모달 열기
    const openModal = () => {
        Keyboard.dismiss(); // 웹 포커스 충돌 방지
        setModalVisible(true);
    };

    // 🔑 모달 닫기
    const closeModal = () => {
        Keyboard.dismiss();
        setModalVisible(false);
        dropdownRef.current?.focus?.(); // 포커스를 버튼으로 복귀
    };

    const handleSelectBoard = (option) => {
        setBoard(option.label);
        closeModal();
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* 헤더 */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>글쓰기</Text>
                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>등록</Text>
                </Pressable>
            </View>

            {/* 입력 폼 */}
            <View style={styles.form}>
                {/* 게시판 선택 */}
                <Pressable
                    ref={dropdownRef} // 🔑 ref 연결
                    style={styles.dropdownBox}
                    onPress={openModal}
                    accessibilityRole="button"
                    accessibilityLabel={`현재 게시판: ${board}. 눌러서 변경`}
                >
                    <Text style={styles.dropdownText}>{board}</Text>
                    <Ionicons name="chevron-down" size={18} color="#666" />
                </Pressable>

                {/* 제목 */}
                <TextInput
                    style={styles.inputTitle}
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* 내용 */}
                <TextInput
                    style={styles.inputContent}
                    placeholder="내용을 입력하세요"
                    placeholderTextColor="#999"
                    multiline
                    value={content}
                    onChangeText={setContent}
                />

                {/* 이미지 업로드 */}
                <Pressable onPress={handlePickImage} style={styles.imageUploadBtn}>
                    <Text>이미지 선택</Text>
                </Pressable>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {images.map((uri, idx) => (
                        <Image
                            key={idx}
                            source={{ uri }}
                            style={{ width: 80, height: 80, margin: 5, borderRadius: 8 }}
                        />
                    ))}
                </View>
            </View>

            {/* ✅ react-native-modal 하단시트 */}
            <Modal
                isVisible={modalVisible}
                onBackdropPress={closeModal}
                useNativeDriver={false} // 🔑 웹 접근성 충돌 방지
                style={{ justifyContent: "flex-end", margin: 0 }}
            >
                <View style={styles.bottomSheet}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.modalTitle}>게시판 선택</Text>
                    <FlatList
                        data={BOARD_OPTIONS}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.modalItem}
                                onPress={() => handleSelectBoard(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`게시판 ${item.label} 선택`}
                            >
                                <Text style={styles.modalItemText}>{item.label}</Text>
                            </Pressable>
                        )}
                    />
                    <Pressable
                        style={styles.modalCancel}
                        onPress={closeModal}
                        accessibilityRole="button"
                        accessibilityLabel="게시판 선택 취소"
                    >
                        <Text style={styles.modalCancelText}>취소</Text>
                    </Pressable>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
