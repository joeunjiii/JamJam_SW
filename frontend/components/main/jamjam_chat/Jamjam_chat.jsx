// jamjam_chat.jsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Pressable, Image
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles, COLORS } from './style/jamjam_chat.styles';
import FindFriend from './FindFriend';
import { dmApi } from './service/dmApi';

/**
 * 서버가 주는 대표 케이스
 * 1) DmThreadWithLastMessage
 *    - threadId, otherUserId, otherUserNickname, otherUserProfileImage,
 *      lastMessage, lastMessageTime, unreadCount
 * 2) DmThreadDto
 *    - threadId, user1Id, user2Id, createdAt
 * 3) 그 외(과거 코드/테스트 더미 등)
 *    - id, name, avatarUrl, lastMessageAt 등
 *
 * 아래 타입 정의는 IDE 경고(Unresolved variable ...)를 줄이기 위한 JSDoc이며,
 * 실제 런타임 제약은 없음.
 */

/**
 * @typedef {Object} DmThreadWithLastMessage
 * @property {number} threadId
 * @property {number} [otherUserId]
 * @property {string} [otherUserNickname]
 * @property {string} [otherUserProfileImage]
 * @property {string} [lastMessage]
 * @property {string} [lastMessageTime]  // ISO
 * @property {number} [unreadCount]
 * @property {string} [createdAt]        // 백엔드가 넣을 수도 있음
 */

/**
 * @typedef {Object} DmThreadDto
 * @property {number} threadId
 * @property {number} user1Id
 * @property {number} user2Id
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UiChatItem
 * @property {string} id
 * @property {string} name
 * @property {string} lastMessage
 * @property {string} time
 * @property {number} unreadCount
 * @property {string|null} avatarUrl
 */

const JamjamChat = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [chatData, setChatData] = useState([]);
    const [friendModal, setFriendModal] = useState(false);

    useEffect(() => {
        (async () => {
            const threads = await dmApi.getThreads();
            /** @type {UiChatItem[]} */
            const items = threads.map(mapThreadToUi);
            setChatData(items);
        })();
    }, []);

    const ChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate("ChatRoom", { chatId: item.id })}
        >
            <View style={styles.avatarContainer}>
                {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                    <Image source={require("../../../assets/main/chat/avatar1.png")} style={styles.avatarImage} />
                )}
            </View>

            <View style={styles.chatContent}>
                <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>

            <View style={styles.meta}>
                <Text style={styles.chatTime}>{item.time}</Text>
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>
                <Image source={require("../../../assets/main/namelogo.png")} style={styles.headerLogo} />
                <Pressable onPress={() => {}} style={styles.headerButton}>
                    <Feather name="bell" size={22} color={COLORS.gray800} />
                </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.bgCurve}>
                    {/* 검색바 */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <Ionicons name="search" size={18} color={COLORS.gray500} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="닉네임/대화내용을 검색"
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholderTextColor={COLORS.gray500}
                            />
                        </View>
                    </View>

                    {/* 채팅 리스트 */}
                    <FlatList
                        data={chatData.filter(f => filterItem(f, searchText))}
                        renderItem={({ item }) => <ChatItem item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>

            {/* 새 대화 시작 */}
            <TouchableOpacity style={styles.fab} onPress={() => setFriendModal(true)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            <FindFriend
                visible={friendModal}
                onClose={() => setFriendModal(false)}
                onAdd={async (nickname) => {
                    try {
                        const thread = await dmApi.createThreadByNickname(nickname);
                        setFriendModal(false);
                        navigation.navigate("ChatRoom", { chatId: String(thread.threadId) });
                    } catch (e) {
                        console.warn("create thread failed:", e);
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default JamjamChat;

/** ---------- 매핑/유틸 ---------- */

/**
 * 서버 DTO(여러 케이스)를 안전하게 UI 아이템으로 변환.
 * @param {any} t
 * @returns {UiChatItem}
 */
function mapThreadToUi(t) {
    // id
    const id = String(
        t?.threadId ??
        t?.id ??                                // 혹시 과거 테스트 케이스
        ""
    );

    // 이름 후보: otherUserNickname > nickname > name > "사용자"
    const name =
        t?.otherUserNickname ??
        t?.nickname ??
        t?.otherNickname ??
        t?.name ??
        "사용자";

    // 마지막 메시지/시간 후보
    const lastMessage = t?.lastMessage ?? t?.last ?? "";
    const lastTimeRaw =
        t?.lastMessageTime ?? t?.updatedAt ?? t?.createdAt ?? null;

    // 프로필 이미지 후보
    const avatarUrl =
        t?.otherUserProfileImage ??
        t?.profileImageUrl ??
        t?.avatarUrl ??
        null;

    // 미확인 카운트
    const unreadCount = Number(
        t?.unreadCount ?? t?.unread ?? 0
    );

    return {
        id,
        name,
        lastMessage,
        time: toRelative(lastTimeRaw),
        unreadCount,
        avatarUrl,
    };
}

function toRelative(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    // 필요 시 상대시간 포맷으로 교체 가능
    return d.toLocaleString();
}

function filterItem(item, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
        (item.name || "").toLowerCase().includes(s) ||
        (item.lastMessage || "").toLowerCase().includes(s)
    );
}
