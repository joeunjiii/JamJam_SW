import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "../community/style/Community.styles";

export default function PostItem({ item, onPress }) {
    return (
        <Pressable onPress={() => onPress?.(item)} style={styles.item}>
            <View style={{ flex: 1 }}>
                {/* 🔴 점 + (제목 + 메타) */}
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    {/* 빨간 점 */}
                    {/* 빨간 점 (제목 왼쪽에 절대 위치) */}
                    {item.isNew && (
                        <View style={styles.newDotWrapper}>
                            <View style={styles.newDot} />
                        </View>
                    )}

                    {/* 제목 + 닉네임/시간 묶음 */}
                    <View style={{ flex: 1 }}>
                        {/* 제목 */}
                        <Text
                            numberOfLines={2}
                            style={[styles.title, item.hot && { marginTop: 6 }]}
                        >
                            {item.title}
                        </Text>
                        {/* 닉네임 + 시간 */}
                        <View style={styles.metaRow}>
                            <Text style={styles.metaText}>{item.author}</Text>
                            <Text style={styles.metaText}>{item.createdAt}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 댓글 말풍선 (오른쪽 고정) */}
            <View style={styles.commentBubble}>
                <Text style={styles.commentCount}>{item.commentCount}</Text>
                <Text style={styles.commentLabel}>댓글</Text>
            </View>
        </Pressable>
    );
}