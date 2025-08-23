import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    SafeAreaView,
    Modal,
    FlatList,
    LayoutAnimation, UIManager, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./style/PostWriteScreen.styles";

const BOARD_OPTIONS = [
    { key: "notice", label: "공지사항" },
    { key: "free", label: "자유게시판" },
    { key: "qa", label: "질문게시판" },
    { key: "info", label: "정보공유" },
];

export default function PostWriteScreen({ navigation }) {
    const [board, setBoard] = useState("게시판 선택");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSubmit = () => {
        console.log({ board, title, content });
        navigation.goBack();
    };

    const handleSelectBoard = (option) => {
        setBoard(option.label);
        setModalVisible(false);
    };
    const toggleDropdown = () => {
        LayoutAnimation.easeInEaseOut();
        setDropdownOpen(!dropdownOpen);
    };

    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    return (
        <SafeAreaView style={styles.safe}>
            {/* ✅ 헤더 */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>글쓰기</Text>
                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>등록</Text>
                </Pressable>
            </View>

            {/* ✅ 입력 폼 */}
            <View style={styles.form}>
                {/* 게시판 선택 */}
                <Pressable
                    style={styles.dropdownBox}
                    onPress={() => setDropdownOpen(!dropdownOpen)}
                >
                    <Text style={styles.dropdownText}>{board}</Text>
                </Pressable>
                {dropdownOpen && (
                    <View style={styles.dropdownList}>
                        {BOARD_OPTIONS.map((item) => (
                            <Pressable
                                key={item.key}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setBoard(item.label);
                                    setDropdownOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}
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
            </View>

            {/* ✅ 바텀시트 모달 */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>게시판 선택</Text>
                        <FlatList
                            data={BOARD_OPTIONS}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.modalItem}
                                    onPress={() => handleSelectBoard(item)}
                                >
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable
                            style={styles.modalCancel}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelText}>취소</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
