import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Pressable,
    ScrollView,
    RefreshControl,
    Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS, TABS } from "./style/Community.styles";
import PostItem from "../community/PostItem";
import { fetchPosts } from "../community/PostItem";
import { layoutStyles } from "../../commonUI/Layout.styles";
import BottomNavBar from "./BottomNavBar";


export default function CommunityHomeScreen({ navigation }) {

    //목업데이터
    const MOCK_POSTS = [
        {
            id: 1,
            title: "앱 사용 가이드",
            content: "잼잼 커뮤니티를 안전하게 사용하는 방법을 안내합니다.",
            isPinned: true,
            author: "관리자",
            createdAt: "1일 전",
            commentCount: 12,
            category: "notice",  // 공지사항
        },
        {
            id: 2,
            title: "커뮤니티 이용규칙",
            content: "서로를 존중하며 소통하는 공간을 만들어가요.",
            isPinned: true,
            author: "운영팀",
            createdAt: "3일 전",
            commentCount: 7,
            category: "notice",
        },
        {
            id: 3,
            title: "첫 임신, 궁금한 게 너무 많아요",
            content: "12주차인데 갑자기 입덧이 심해졌어요. 비슷한 경험 있으신가요?",
            isPinned: false,
            author: "초보엄마",
            createdAt: "2시간 전",
            commentCount: 5,
            category: "qa",
        },
        {
            id: 4,
            title: "아기 수면 교육 어떻게 시작했나요?",
            content: "밤낮 구분이 안돼서 매일 힘들어요 ㅠㅠ 팁 공유해주세요!",
            isPinned: false,
            author: "수면교육중",
            createdAt: "5시간 전",
            commentCount: 3,
            category: "free",
        },
        {
            id: 5,
            title: "남편이 육아에 관심이 없어요",
            content: "대화도 해봤는데 여전히 무관심한 것 같아요... 어떻게 해야 할까요?",
            isPinned: false,
            author: "맘스터치",
            createdAt: "어제",
            commentCount: 8,
            category: "free",
        },
        {
            id: 6,
            title: "잼잼 커뮤니티 오픈 안내",
            content: "잼잼 커뮤니티가 새롭게 오픈했습니다! 많은 참여 부탁드려요.",
            isPinned: false,
            author: "운영팀",
            createdAt: "5일 전",
            commentCount: 2,
            category: "notice",
        },
        {
            id: 7,
            title: "커뮤니티 점검 안내 (8/20 새벽)",
            content: "시스템 점검으로 인해 8/20 새벽 2시~4시까지 이용이 제한됩니다.",
            isPinned: false,
            author: "관리자",
            createdAt: "2일 전",
            commentCount: 0,
            category: "notice",
        },
        {
            id: 8,
            title: "잼잼 사용법 영상 가이드 추가",
            content: "영상으로 쉽게 배우는 커뮤니티 사용법을 확인해보세요!",
            isPinned: false,
            author: "운영자",
            createdAt: "1일 전",
            commentCount: 4,
            category: "notice",
        },
        {
            id: 9,
            title: "오늘 가입했어요! 잘 부탁드려요",
            content: "첫 글 남깁니다~",
            author: "새내기맘",
            createdAt: "방금 전",
            commentCount: 0,
            category: "free",
            isNew: true,   // ✅ 새 글이면 빨간 점 표시
        }

    ];





    const [tab, setTab] = useState("all");
    const [data, setData] = useState([]);
    const [next, setNext] = useState(2);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadFirst = useCallback(async () => {
        setLoading(true);
        const { items, nextPage } = await fetchPosts({
            page: 1,
            pageSize: 10,
            category: tab,
        });
        setData(items);
        setNext(nextPage);
        setLoading(false);
    }, [tab]);

    const loadMore = useCallback(async () => {
        if (!next || loading) return;
        setLoading(true);
        const { items, nextPage } = await fetchPosts({
            page: next,
            pageSize: 10,
            category: tab,
        });
        setData((prev) => [...prev, ...items]);
        setNext(nextPage);
        setLoading(false);
    }, [next, tab, loading]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadFirst();
        setRefreshing(false);
    }, [loadFirst]);

    const filteredPosts = tab === "all"
        ? MOCK_POSTS
        : MOCK_POSTS.filter((p) => p.category === tab);

    const pinnedPosts = filteredPosts.filter((p) => p.isPinned);
    const normalPosts = filteredPosts.filter((p) => !p.isPinned);



    return (
        <View style={layoutStyles.wrapper}>
            <View style={layoutStyles.bgCurveBox} />

            <SafeAreaView style={layoutStyles.container}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                        <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                    </Pressable>
                    <Image
                        source={require("../../../assets/main/namelogo.png")}
                        style={{ width: 100, height: 40, resizeMode: "contain" }}
                    />
                    <Feather name="bell" size={20} color={COLORS.text} />
                </View>
                {/* 탭 */}
                <View style={styles.tabsRow}>
                    <Image
                        source={require("../../../assets/main/community/Community_icon.png")}
                        style={styles.iconImage}
                    />
                    <View style={styles.tabGroup}>
                        {TABS.map((t) => (
                            <Pressable
                                key={t.key}
                                style={styles.tabBtn}
                                onPress={() => setTab(t.key)}
                            >
                                <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                                    {t.label}
                                </Text>
                                {tab === t.key && <View style={styles.underline} />}
                            </Pressable>
                        ))}
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={layoutStyles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
                >
                    {/* 필독 게시글 */}
                    {pinnedPosts.length > 0 && (
                        <View style={styles.pinnedBox}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <View style={styles.pinnedBadge}>
                                    <Text style={styles.pinnedBadgeText}>필독</Text>
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222" }}>
                                    꼭 확인해 주세요
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* 일반 게시글 */}
                    {normalPosts.map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </ScrollView>
            </SafeAreaView>
            {/* ✅ 하단바 고정 */}
            <BottomNavBar
                active="home"
                onTabPress={(key) => {
                    if (key === "home") navigation.navigate("Main"); // 메인화면
                    if (key === "chat") navigation.navigate("JamJamTalkScreen");
                    if (key === "write") navigation.navigate("CommunityWriteScreen");
                    // 다른 탭도 네비게이션 연결
                }}
            />
        </View>
    );
}
