import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { styles } from "../community/style/Community.styles";

export default function PostItem({ item, onPress }) {
  return (
    <Pressable onPress={() => onPress?.(item)} style={styles.item}>
      <View style={{ flex: 1 }}>
        {/* 핫 배지 */}
        {item.hot && <Text style={styles.badgeNow}>지금 엄청 많이 보고 있어요!</Text>}
        {/* 제목 */}
        <Text
          numberOfLines={2}
          style={[styles.title, item.hot && { marginTop: 6 }]}
        >
          {item.title}
        </Text>
        {/* 썸네일(예시로 비디오 프레임 자리) */}
        {item.thumbnail === "video" && (
          <View style={styles.thumbBox}>
            {/* 실제에선 Image or 썸네일 url */}
            <Image
              source={require("../../../assets/main/baby.png")}
              style={{ width: "100%", height: 160, resizeMode: "cover", borderRadius: 12 }}
            />
          </View>
        )}
        {/* 메타 */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.author}</Text>
          <Text style={styles.metaText}>{item.createdAt}</Text>
        </View>
      </View>

      {/* 댓글 말풍선 */}
      <View style={styles.commentBubble}>
        <Text style={styles.commentCount}>{item.commentCount}</Text>
        <Text style={styles.commentLabel}>댓글</Text>
      </View>
    </Pressable>
  );
}
