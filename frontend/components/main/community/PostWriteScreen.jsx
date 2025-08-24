import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    SafeAreaView,
    Modal,
    FlatList,
    LayoutAnimation,
    UIManager,
    Platform,
    StyleSheet
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


    const handleSubmit = () => {
        console.log({ board, title, content });
        navigation.goBack();
    };

    const handleSelectBoard = (option) => {
        setBoard(option.label);
        setModalVisible(false);
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
                {/* 게시판 선택 → 하단시트 */}
                <Pressable
                    style={styles.dropdownBox}
                    onPress={() => setModalVisible(true)}
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
            </View>

            {/* 하단시트 모달 */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* 오버레이 닫기용 */}
                    <Pressable
                        style={StyleSheet.absoluteFill}   // 화면 전체 덮기
                        onPress={() => setModalVisible(false)}
                    />

                    {/* 바텀시트 */}
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