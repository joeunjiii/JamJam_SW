import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { styles } from "./style/Community.styles";
import { fetchPostDetail } from "./service/communityService";

export default function PostDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostDetail(id);
        setPost(data);
      } catch (err) {
        console.error("❌ 게시글 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
        <SafeAreaView style={styles.safe}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={{ marginTop: 8, color: "#999" }}>불러오는 중...</Text>
          </View>
        </SafeAreaView>
    );
  }

  if (!post) {
    return (
        <SafeAreaView style={styles.safe}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#999" }}>게시글을 불러올 수 없습니다.</Text>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.safe}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
            <Text style={styles.headerBack}>〈</Text>
          </Pressable>
          <Text style={styles.headerTitle}>게시글</Text>
          <View style={{ width: 24 }} /> {/* 오른쪽 공간 맞춤 */}
        </View>

        {/* 본문 */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* 제목 */}
          <Text style={styles.detailTitle}>{post.title}</Text>

          {/* 메타 정보 */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{post.nickname}</Text> {/* ✅ 닉네임 */}
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>
              {new Date(post.createdAt).toLocaleString()} {/* ✅ 날짜 변환 */}
            </Text>
            {post.commentCount !== undefined && (
                <>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>댓글 {post.commentCount}</Text>
                </>
            )}
          </View>

          {/* 본문 내용 */}
          <Text style={styles.detailContent}>{post.body}</Text>
        </ScrollView>
      </SafeAreaView>
  );
}
