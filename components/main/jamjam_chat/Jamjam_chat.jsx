// jamjam_chat.jsx (React Native)
import React, { useState } from 'react';
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

const JamjamChat = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

    // 목업 데이터 백엔드연결할때 삭제
    const chatData = [
        {
            id: '1',
            name: '잼잼잼잼',
            lastMessage: '육아 나눔 돌봄해요',
            time: '오후 1:20',
            unreadCount: 0,
            avatar: require("../../../assets/main/chat/avatar1.png"),
        },
        {
            id: '2',
            name: '수달이',
            lastMessage: '아이템 대화내용',
            time: '8월 13일',
            unreadCount: 0,
            avatar: require("../../../assets/main/chat/avatar2.png"),
        },
        {
            id: '3',
            name: '민지맘',
            lastMessage: '오늘 놀이터에서 만나요!',
            time: '오전 11:30',
            unreadCount: 2,
            avatar: require("../../../assets/main/chat/avatar3.png"),
        },
        {
            id: '4',
            name: '육아모임',
            lastMessage: '이번 주 모임 장소가 변경되었어요',
            time: '어제',
            unreadCount: 5,
            avatar: require("../../../assets/main/chat/avatar1.png"),
        }
    ];

    const ChatItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => console.log(`Clicked on ${item.name}`)}>
            {/* 아바타 */}
            <View style={styles.avatarContainer}>
                <Image
                    source={item.avatar} // item.avatar를 require로 가져오게
                    style={styles.avatarImage}
                    resizeMode="contain"
                />
            </View>

            {/* 본문: 이름 + 마지막 메시지 */}
            <View style={styles.chatContent}>
                <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>

            {/* ✅ 메타 컬럼: 시간(고정 상단) + 배지(시간 아래) */}
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

    const handleSearch = (text) => {
        setSearchText(text);
        console.log('Search:', text);
    };

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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleHeaderBack} style={styles.headerButton}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>
                <Image source={require("../../../assets/main/namelogo.png")} style={styles.headerLogo} />
                <Pressable onPress={handleNotification} style={styles.headerButton}>
                    <Feather name="bell" size={22} color={COLORS.gray800} />
                </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* ✅ 곡선 박스 컨테이너 */}
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
            <TouchableOpacity style={styles.fab} onPress={handleAddChat}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>


    );
};

export default JamjamChat;