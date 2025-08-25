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
import { layoutStyles } from "../../commonUI/Layout.styles";
import BottomNavBar from "./BottomNavBar";
import { fetchPosts, fetchPinnedPosts } from "./service/communityService";
import NoticeModal from "./modal/NoticeModal";


export default function CommunityHomeScreen({ navigation }) {
    const [tab, setTab] = useState("all");
    const [data, setData] = useState([]);
    const [pinned, setPinned] = useState([]);
    const [next, setNext] = useState(2);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [noticeVisible, setNoticeVisible] = useState(false);


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

        // 📌 필독글 따로 불러오기
        const pinnedPosts = await fetchPinnedPosts();
        setPinned(pinnedPosts);
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

    useEffect(() => {
        loadFirst();
    }, [tab]);

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
                    <View style={styles.tabGroup}>
                        {TABS.map((t) => {
                            const active = tab === t.key;
                            return (
                                <Pressable
                                    key={t.key}
                                    style={({ pressed }) => [
                                        styles.tabBtn,
                                        active && styles.tabBtnActive,
                                        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] } // pill 눌리는 효과
                                    ]}
                                    onPress={() => setTab(t.key)}
                                >
                                    <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                        {t.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
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
                    {pinned.length > 0 && (
                        <View style={styles.pinnedBox}>
                            <Pressable
                                onPress={() => setNoticeVisible(true)}
                                style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}
                            >
                                <View style={styles.pinnedBadge}>
                                    <Text style={styles.pinnedBadgeText}>필독</Text>
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222" }}>
                                    이곳을 눌러서 게시판 규칙을 확인해주세요
                                </Text>
                            </Pressable>

                            {pinned.map((item) => (
                                <PostItem key={item.id} item={item} />
                            ))}
                        </View>
                    )}
                    <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} />
                    {/* 일반 게시글 */}
                    {data.map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* ✅ 하단바 고정 */}
            <BottomNavBar
                active="home"
                onTabPress={(key) => {
                    if (key === "home") navigation.navigate("Main");
                    if (key === "chat") navigation.navigate("Chat");
                    if (key === "write") navigation.navigate("PostWriteScreen");
                }}
            />
        </View>
    );
}
