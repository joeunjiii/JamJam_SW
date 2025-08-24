// ChatRoom.jsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Pressable,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/chatroom.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { fetchMessages, sendMessage } from "./service/chatService";
import * as ImagePicker from "expo-image-picker";
import { MotiView, AnimatePresence } from "moti";



const ChatRoom = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [input, setInput] = useState("");
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [showMenu, setShowMenu] = useState(false);


    // 갤러리
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            console.log("갤러리 이미지:", result.assets[0].uri);
            // 여기서 sendMessage로 이미지 업로드 로직 연결
        }
        setModalVisible(false);
    };

    // 카메라
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            console.log("카메라 사진:", result.assets[0].uri);
            // 여기서 sendMessage로 이미지 업로드 로직 연결
        }
        setModalVisible(false);
    };


    const renderMessage = ({ item }) => (
        <View style={[styles.messageRow, item.isMe ? styles.myRow : styles.otherRow]}>
            {!item.isMe && (
                <Image
                    source={require("../../../assets/main/chat/avatar1.png")}
                    style={styles.avatar}
                />
            )}
            <View style={styles.messageContent}>
                {!item.isMe && <Text style={styles.sender}>{item.sender}</Text>}
                <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMsg = await sendMessage(chatId, input);
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
    };
    useEffect(() => {
        fetchMessages(chatId).then(setMessages);
    }, [chatId]);


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>

                <Image
                    source={require("../../../assets/main/namelogo.png")}
                    style={{
                        position: "absolute",
                        left: "40%",
                        width: 100,
                        height: 40,
                        resizeMode: "contain",
                    }}
                />
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >

                <View style={styles.bgCurve}>
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                    />
                </View>

                {/* Input Bar (항상 화면 하단 고정) */}
                <View style={styles.inputBar}>
                    <Pressable style={styles.addButton} onPress={() => setShowMenu(true)}>
                        <Ionicons name="add" size={22} color="white" />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        placeholder="메시지를 입력하세요"
                        value={input}
                        onChangeText={setInput}
                    />
                    <Pressable style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="white" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>



            <AnimatePresence>
                {/* 중앙 메뉴 모달 */}
                {showMenu && (
                    <View style={styles.centerOverlay}>
                        <View style={styles.centerMenu}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuBtn,
                                    pressed && styles.menuBtnPressed
                                ]}
                                onPress={pickImage}
                            >
                                <Ionicons name="image" size={22} color={COLORS.primary} />
                                <Text style={styles.menuText}>갤러리</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuBtn,
                                    pressed && styles.menuBtnPressed
                                ]}
                                onPress={takePhoto}
                            >
                                <Ionicons name="camera" size={22} color={COLORS.primary} />
                                <Text style={styles.menuText}>카메라</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuBtn,
                                    pressed && styles.menuBtnPressed
                                ]}
                                onPress={() => setShowMenu(false)}
                            >
                                <Ionicons name="close" size={22} color="red" />
                                <Text style={[styles.menuText, { color: "red" }]}>취소</Text>
                            </Pressable>

                        </View>
                    </View>
                )}
            </AnimatePresence>
        </SafeAreaView>
    );
};

export default ChatRoom;
