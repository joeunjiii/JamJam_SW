import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import { styles } from "./style/Community.styles";
import { fetchPostDetail } from "./service/communityService";

export default function PostDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      setPost(await fetchPostDetail(id));
    })();
  }, [id]);

  if (!post) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Text style={styles.headerBack}>〈</Text>
        </Pressable>
        <Text style={styles.headerTitle}>게시글</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.detailTitle}>{post.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{post.author}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{post.createdAt}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>댓글 {post.commentCount}</Text>
        </View>
        <Text style={styles.detailContent}>{post.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
