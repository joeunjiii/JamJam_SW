import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Pressable } from "react-native";
import { fetchPosts } from "./service/communityService";
import PostItem from "./PostItem";
import { styles } from "./style/Community.styles";

export default function CommunityHomeScreen({ navigation }) {
    const [tab, setTab] = useState("all");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const loadPosts = useCallback(async () => {
        try {
            const data = await fetchPosts({ page, size: 10, board: tab });
            if (page === 0) {
                setPosts(data.content);
            } else {
                setPosts((prev) => [...prev, ...data.content]);
            }
        } catch (e) {
            console.error("❌ 게시글 로드 실패:", e);
        }
    }, [page, tab]);

    useEffect(() => {
        setPage(0);
        loadPosts();
    }, [tab]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(0);
        await loadPosts();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.tabsRow}>
                {["all", "free", "qa", "notice"].map((b) => (
                    <Pressable key={b} onPress={() => setTab(b)} style={styles.tabBtn}>
                        <Text style={tab === b ? styles.tabTextActive : styles.tabText}>
                            {b}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {posts.map((item) => (
                    <PostItem
                        key={item.postId}
                        item={item}
                        onPress={(post) => navigation.navigate("PostDetailScreen", { id: post.postId })}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
