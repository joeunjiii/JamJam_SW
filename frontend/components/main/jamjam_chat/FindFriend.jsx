// FindFriend.jsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    Pressable,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, COLORS } from "./style/findFriend.styles";

const FindFriend = ({ visible, onClose, onAdd }) => {
    const [nickname, setNickname] = useState("");

    const handleAdd = () => {
        if (!nickname.trim()) return;
        onAdd(nickname.trim());
        setNickname("");
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* 오버레이 배경 */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                {/* 모달 박스 */}
                <View style={styles.modalContainer}>
                    {/* 헤더 */}
                    <View style={styles.header}>
                        <Text style={styles.title}>친구찾기</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color={COLORS.gray700} />
                        </TouchableOpacity>
                    </View>

                    {/* 입력 */}
                    <TextInput
                        style={styles.input}
                        placeholder="닉네임 입력"
                        value={nickname}
                        onChangeText={setNickname}
                        placeholderTextColor={COLORS.gray500}
                    />

                    {/* 버튼 */}
                    <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                        <Text style={styles.addButtonText}>대화 시작</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FindFriend;
