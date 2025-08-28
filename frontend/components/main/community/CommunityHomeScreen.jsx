import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Pressable } from "react-native";
import { fetchPosts } from "./service/communityService";
import PostItem from "./PostItem";
import { styles, TABS } from "./style/Community.styles";

export default function CommunityHomeScreen({ navigation }) {
    const [tab, setTab] = useState("all");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadPosts = useCallback(async () => {
        if (loading) return; // 중복 로딩 방지

        try {
            setLoading(true);
            const data = await fetchPosts({ page, size: 10, board: tab });

            if (page === 0) {
                setPosts(data.content);
            } else {
                setPosts((prev) => [...prev, ...data.content]);
            }
        } catch (e) {
            console.error("❌ 게시글 로드 실패:", e);
        } finally {
            setLoading(false);
        }
    }, [page, tab, loading]);

    useEffect(() => {
        setPage(0);
        setPosts([]); // 탭 변경 시 기존 게시글 초기화
        loadPosts();
    }, [tab]);

    useEffect(() => {
        if (page > 0) {
            loadPosts();
        }
    }, [page]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(0);
        await loadPosts();
        setRefreshing(false);
    };

    const handleEndReached = () => {
        if (!loading && posts.length >= 10) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* 헤더 영역 (필요 시 추가) */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>커뮤니티</Text>
            </View>

            {/* 탭 영역 */}
            <View style={styles.tabsRow}>
                <View style={styles.tabGroup}>
                    {TABS.map((tabItem) => (
                        <Pressable
                            key={tabItem.key}
                            onPress={() => setTab(tabItem.key)}
                            style={[
                                styles.tabBtn,
                                tab === tabItem.key && styles.tabBtnActive // 활성 탭 스타일 적용
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    tab === tabItem.key && styles.tabTextActive // 활성 텍스트 스타일
                                ]}
                            >
                                {tabItem.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* 게시글 리스트 */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#FF6B6B" // iOS 새로고침 색상
                        colors={["#FF6B6B"]} // Android 새로고침 색상
                    />
                }
                onScroll={({ nativeEvent }) => {
                    // 무한 스크롤 구현
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const paddingToBottom = 20;
                    const isEndReached =
                        layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - paddingToBottom;

                    if (isEndReached) {
                        handleEndReached();
                    }
                }}
                scrollEventThrottle={16}
            >
                {posts.length === 0 && !loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>
                            아직 게시글이 없습니다.
                        </Text>
                    </View>
                ) : (
                    posts.map((item) => (
                        <PostItem
                            key={item.postId}
                            item={item}
                            onPress={() => navigation.navigate("PostDetailScreen", {
                                id: item.postId,
                                board: tab // 현재 탭 정보도 전달
                            })}
                        />
                    ))
                )}

                {/* 로딩 인디케이터 */}
                {loading && page > 0 && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#999' }}>불러오는 중...</Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB 버튼 (글쓰기) */}
            <Pressable
                style={styles.fab}
                onPress={() => navigation.navigate("PostWriteScreen", { board: tab })}
            >
                <Text style={styles.fabPlus}>+</Text>
            </Pressable>
        </SafeAreaView>
    );
}