// ChatRoom.jsx
import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/chatroom.styles";
import * as ImagePicker from "expo-image-picker";
import { MotiView, AnimatePresence } from "moti";
import { ChatSocket } from "./ws/ChatSocket";
import { dmApi } from "./service/dmApi";
import { storage } from "../../login/service/storage";

const WS_URL =
    process.env.EXPO_PUBLIC_WS_URL ||
    process.env.REACT_APP_WS_URL ||
    "ws://localhost:8082/ws-native";

const ChatRoom = ({ navigation, route }) => {
    const { chatId: threadId } = route.params; // threadId로 사용
    const [modalVisible, setModalVisible] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // [{id, text, time, isMe, senderId, fileUrl}]
    const [showMenu, setShowMenu] = useState(false);
    const [myId, setMyId] = useState(null);

    const socketRef = useRef(null);
    const lastMessageIdRef = useRef(null); // 과거 로딩 기준점

    // 내 userId 불러오기
    useEffect(() => {
        (async () => {
            const id = await storage.getItem("userId");
            setMyId(id ? Number(id) : null);
        })();
    }, []);

    // STOMP 연결 + 구독
    useEffect(() => {
        const sock = new ChatSocket({
            wsUrl: WS_URL,
            onEvent: (ev) => {
                if (ev.type === "CHAT" && Number(ev.threadId) === Number(threadId)) {
                    const ui = serverMsgToUiItem(ev, myId);
                    setMessages((prev) => appendIfNotExists(prev, ui));
                    lastMessageIdRef.current = ev.messageId ?? lastMessageIdRef.current;
                }
            },
            onDebug: (s) => console.log(s),
        });
        socketRef.current = sock;

        (async () => {
            await sock.connect();
            sock.subscribeThread(threadId);
        })();

        return () => {
            sock.unsubscribeThread?.(threadId);
            sock.disconnect();
        };
    }, [threadId, myId]);

    // 최초 메시지 로딩
    useEffect(() => {
        (async () => {
            const list = await dmApi.loadRecent(threadId, 50);
            const uiList = list
                .slice()
                .reverse()
                .map((m) => serverMsgToUiItem(m, myId));
            setMessages(uiList);
            lastMessageIdRef.current = list[0]?.messageId || null;
        })();
    }, [threadId, myId]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const payload = { body: input, fileUrl: null };

        // 낙관적 업데이트
        const optimistic = {
            id: "tmp-" + Date.now(),
            text: input,
            time: new Date().toLocaleTimeString(),
            isMe: true,
            senderId: myId,
            fileUrl: null,
        };
        setMessages((prev) => [...prev, optimistic]);
        setInput("");

        try {
            await dmApi.sendMessage(threadId, payload);
            // 서버가 push 해주므로 별도 처리 불필요 (appendIfNotExists로 중복 방지)
        } catch (e) {
            console.warn("send failed:", e);
        }
    };

    // 갤러리
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            const fileUrl = result.assets[0].uri;
            await dmApi.sendMessage(threadId, { body: null, fileUrl });
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
            const fileUrl = result.assets[0].uri;
            await dmApi.sendMessage(threadId, { body: null, fileUrl });
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
                {!item.isMe && item.senderName && (
                    <Text style={styles.sender}>{item.senderName}</Text>
                )}
                <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
                    {item.fileUrl ? (
                        <Image source={{ uri: item.fileUrl }} style={{ width: 180, height: 160, borderRadius: 8 }} />
                    ) : (
                        <Text style={styles.messageText}>{item.text}</Text>
                    )}
                </View>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

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
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                    />
                </View>

                {/* Input Bar */}
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
                {showMenu && (
                    <View style={styles.centerOverlay}>
                        <View style={styles.centerMenu}>
                            <Pressable style={styles.menuBtn} onPress={pickImage}>
                                <Ionicons name="image" size={22} color={COLORS.primary} />
                                <Text style={styles.menuText}>갤러리</Text>
                            </Pressable>

                            <Pressable style={styles.menuBtn} onPress={takePhoto}>
                                <Ionicons name="camera" size={22} color={COLORS.primary} />
                                <Text style={styles.menuText}>카메라</Text>
                            </Pressable>

                            <Pressable style={styles.menuBtn} onPress={() => setShowMenu(false)}>
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

/** ================== 타입 정의 + 매핑 유틸 ================== */
/**
 * 백엔드 DmMessageDto
 * @typedef {Object} DmMessageDto
 * @property {number} messageId
 * @property {number} threadId
 * @property {number} senderId
 * @property {string=} body
 * @property {string=} fileUrl
 * @property {string} createdAt
 */

/**
 * 백엔드 WebSocketMessage
 * @typedef {Object} WebSocketMessage
 * @property {"CHAT"|"ACK"|"ERROR"|"PING"|"PONG"} [type]
 * @property {number=} messageId
 * @property {string=} clientMsgId
 * @property {number} [threadId]
 * @property {number} [senderId]
 * @property {string=} body
 * @property {string=} fileUrl
 * @property {string=} createdAt
 */

/**
 * 첫 번째로 정의된 값 반환 (undefined/null 스킵)
 * @param  {...any} vals
 */
function firstDefined(...vals) {
    for (const v of vals) if (v !== undefined && v !== null) return v;
    return undefined;
}

/**
 * 서버 메시지 DTO → UI 항목으로 변환
 * @param {DmMessageDto|WebSocketMessage} m
 * @param {number|null} myId
 */
function serverMsgToUiItem(m, myId) {
    const isMe = myId ? Number(m?.senderId) === Number(myId) : false;
    const t = toTime(m?.createdAt);

    const id = firstDefined(
        m?.messageId,      // 서버 저장된 메시지
        m?.clientMsgId,    // 클라이언트 생성 임시 ID(ACK 등)
        m?.id              // 혹시 다른 이름으로 올 때 대비
    ) ?? Date.now();

    return {
        id,
        text: m?.body || "",
        fileUrl: m?.fileUrl || null,
        time: t,
        isMe,
        senderId: m?.senderId,
    };
}

function toTime(isoOrNull) {
    try {
        return isoOrNull ? new Date(isoOrNull).toLocaleTimeString() : "";
    } catch {
        return "";
    }
}

function appendIfNotExists(list, item) {
    if (list.some((x) => String(x.id) === String(item.id))) return list;
    return [...list, item];
}
