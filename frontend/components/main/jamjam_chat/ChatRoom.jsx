// ChatRoom.jsx
import React, {useState, useEffect, useMemo} from "react";
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
import { ChatSocket} from "./ws/ChatSocket";
import * as ImagePicker from "expo-image-picker";
import { MotiView, AnimatePresence } from "moti";




const ChatRoom = ({ navigation, route }) => {
    // 네비 파라미터 정의:
    // - threadId(=chatId) : 필수
    // - myUserId : 선택(없으면 isMe 판단 불가 → 모든 메시지를 isMe=false로 표시)
    const { chatId, threadId: _tid, myUserId } = route.params || {};
    const threadId = _tid || chatId;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    // 디버깅 패널
    const logRef = useRef(null);
    const appendDebug = (s) => {
        if (!logRef.current) return;
        const line = document?.createElement
            ? document.createElement("div")
            : null;
        const txt = new Date().toISOString() + " " + String(s);
        if (line && logRef.current.appendChild) {
            line.style.fontSize = "12px";
            line.textContent = txt;
            logRef.current.appendChild(line);
            logRef.current.scrollTop = logRef.current.scrollHeight;
        } else {
            // RN에서는 console.log로 대체
            console.log(txt);
        }
    };

    // WebSocket 인스턴스
    const ws = useMemo(() => new ChatSocket({
        wsUrl: (process.env.EXPO_PUBLIC_WS_URL || process.env.REACT_APP_WS_URL || "ws://localhost:8082/ws-native"),
        onEvent: (ev) => {
            log(`[EV] ${ev.type}`);
            if (ev.type === "CHAT") {
                setMessages((prev) => [...prev, {
                    id: String(ev.messageId || ev.clientMsgId || Date.now()),
                    clientMsgId: ev.clientMsgId,
                    sender: String(ev.senderId),
                    senderId: ev.senderId,
                    text: ev.body || "",
                    time: new Date(ev.createdAt).toLocaleTimeString(),
                    createdAt: ev.createdAt,
                    isMe: !!(myUserId && ev.senderId === myUserId),
                    pending: false,
                }]);
            } else if (ev.type === "ACK" && ev.clientMsgId) {
                setMessages((prev) => prev.map((m) => m.clientMsgId === ev.clientMsgId ? { ...m, id: String(ev.messageId || m.id), pending: false } : m));
            } else if (ev.type === "ERROR") {
                log(`[ERROR] ${ev.errorCode} ${ev.errorMessage || ""}`);
            }
        },
        onDebug: (s) => log(s),
    }), [myUserId]);

    useEffect(() => {
        let mounted = true;

        // 1) 히스토리 로드 (JWT 자동 주입)
        fetchMessages(threadId)
            .then((list) => {
                if (!mounted) return;
                const fixed = list.map((m) => ({ ...m, isMe: !!(myUserId && m.senderId === myUserId) }));
                setMessages(fixed);
            })
            .catch((e) => log("[REST] " + e?.message));

        // 2) WS 연결 & 구독 (JWT 자동 주입)
        (async () => {
            await ws.connect();
            ws.subscribeThread(threadId);
        })();

        return () => {
            mounted = false;
            ws.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    const send = () => {
        if (!input.trim()) return;
        const clientMsgId = "c-" + Math.random().toString(36).slice(2, 10);
        setMessages((prev) => [...prev, {
            id: clientMsgId,
            clientMsgId,
            sender: String(myUserId || "me"),
            senderId: myUserId,
            text: input.trim(),
            time: new Date().toLocaleTimeString(),
            createdAt: new Date().toISOString(),
            isMe: true,
            pending: true,
        }]);
        ws.sendMessage(threadId, { body: input.trim(), clientMsgId });
        setInput("");
    };

    // 이미지 선택(갤러리/카메라) → fileUrl 업로드는 별도 API 후 WS 전송(추후)
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            appendDebug("갤러리 이미지: " + uri);
            // TODO: 파일 업로드 → fileUrl 획득 후 ws.sendMessage(threadId,{fileUrl})
        }
        setShowMenu(false);
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            appendDebug("카메라 사진: " + uri);
            // TODO: 파일 업로드 → fileUrl 획득 후 ws.sendMessage(threadId,{fileUrl})
        }
        setShowMenu(false);
    };

    useEffect(() => {
        let mounted = true;

        // 1) 히스토리 로드(REST) → isMe 보정
        fetchMessages(threadId)
            .then((list) => {
                if (!mounted) return;
                const fixed = list.map((m) => ({
                    ...m,
                    isMe: !!(myUserId && m.senderId === myUserId),
                }));
                setMessages(fixed);
            })
            .catch((e) => appendDebug("[REST] error " + e?.message));

        // 2) WS 연결 & 구독
        ws.connect();
        ws.subscribeThread(threadId);

        return () => {
            mounted = false;
            ws.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    const handleSend = () => {
        if (!input.trim()) return;
        const clientMsgId = "c-" + Math.random().toString(36).slice(2, 10);
        const mine = {
            id: clientMsgId,
            clientMsgId,
            sender: String(myUserId || "me"),
            senderId: myUserId,
            text: input.trim(),
            time: new Date().toLocaleTimeString(),
            createdAt: new Date().toISOString(),
            isMe: true,
            pending: true,
        };
        setMessages((prev) => [...prev, mine]);

        // STOMP 전송
        ws.sendMessage(threadId, { body: mine.text, clientMsgId });
        setInput("");
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageRow, item.isMe ? styles.myRow : styles.otherRow]}>
            {!item.isMe && (
                <Image source={require("../../../assets/main/chat/avatar1.png")} style={styles.avatar} />
            )}
            <View style={styles.messageContent}>
                {!item.isMe && <Text style={styles.sender}>{item.sender}</Text>}
                <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
                <Text style={styles.time}>
                    {item.time} {item.pending ? "· 전송중" : ""} {item.failed ? "· 실패" : ""}
                </Text>
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
                    style={{ position: "absolute", left: "40%", width: 100, height: 40, resizeMode: "contain" }}
                />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
                <View style={styles.bgCurve}>
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
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

            {/* 중앙 메뉴 모달 */}
            <Modal transparent visible={showMenu} animationType="fade" onRequestClose={() => setShowMenu(false)}>
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
            </Modal>

            {/* 디버그 영역: RN에선 console로 보고, 웹에서만 보임 */}
            <View ref={logRef} style={{ height: 0 }} />
        </SafeAreaView>
    );
};

export default ChatRoom;
