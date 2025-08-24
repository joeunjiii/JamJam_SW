// jamjam_chat.jsx (React Native)
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Pressable,
    Image
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles, COLORS } from './style/jamjam_chat.styles';
import { fetchChats } from './service/chatService';
const JamjamChat = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        // 처음 화면 로드 시 데이터 불러오기
        fetchChats().then(setChatData);
    }, []);

    const ChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate("ChatRoom", { chatId: item.id })}
        >
            {/* 아바타 */}
            <View style={styles.avatarContainer}>
                <Image
                    source={item.avatar}
                    style={styles.avatarImage}
                    resizeMode="contain"
                />
            </View>

            {/* 본문 */}
            <View style={styles.chatContent}>
                <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>

            {/* 메타 정보 */}
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



    const handleHeaderBack = () => {
        console.log('Back button clicked');
        navigation?.goBack();
    };

    const handleNotification = () => {
        console.log('Notification clicked');
    };

    const handleAddChat = () => {
        console.log('Add new chat');
    };

    const handleSearch = (text) => setSearchText(text);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>
                <Image source={require("../../../assets/main/namelogo.png")} style={styles.headerLogo} />
                <Pressable onPress={() => console.log("알림")} style={styles.headerButton}>
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
                                onChangeText={handleSearch}
                                placeholderTextColor={COLORS.gray500}
                            />
                        </View>
                    </View>

                    {/* 채팅 리스트 */}
                    <FlatList
                        data={chatData}
                        renderItem={({ item }) => <ChatItem item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => console.log("채팅 추가")}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default JamjamChat;