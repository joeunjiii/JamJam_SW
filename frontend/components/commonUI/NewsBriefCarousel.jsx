import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, FlatList, Image, Pressable, Linking, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// 레이아웃 상수
const H_PADDING = 16;            // 좌우 패딩
const CARD_GAP = 12;             // 카드 간 간격
const ITEM_WIDTH = Math.round(Dimensions.get("window").width - H_PADDING * 2);

// 예시 데이터
const articles = [
    {
        id: 1,
        tag: "잼잼 브리핑",
        title: "영유아 돌봄지원제도, 육아휴직",
        body: "부모들은 ‘영유아 돌봄지원 확대, 육아휴직 의무화, 유연근무제 강화’를 가장 필요한 출산·육아 정책으로 꼽았다.",
        image: require("../../assets/main/news/news-1.jpg"),
        link: "https://ibabynews.com/news/articleView.html?idxno=113710",
    },
    {
        id: 2,
        tag: "잼잼 브리핑",
        title: "2025년 육아 지원제도 알아보기",
        body: "2025년부터 육아휴직 급여 인상·전액 지급, 출산휴가/육아휴직 통합신청, 근로시간 단축 지원 확대, 대체인력·동료 분담 지원 강화 등 부모 지원 제도가 대폭 강화된다.",
        image: require("../../assets/main/news/news-2.jpg"),
        link: "https://blog.naver.com/molab_suda/223716027209?trackingCode=rss",
    },
];

export default function NewsBriefCarousel({ intervalMs = 5000 }) {
    const listRef = useRef(null);
    const [index, setIndex] = useState(0);

    const data = useMemo(() => {
        const a = [...articles];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }, []);

    // 모든 카드의 '정확한' 오프셋을 계산 (좌우 패딩 포함)
    const OFFSETS = useMemo(
        () => data.map((_, i) => H_PADDING + i * (ITEM_WIDTH + CARD_GAP)),
        [data]
    );

    useEffect(() => {
        if (data.length <= 1) return;
        const t = setInterval(() => {
            const next = (index + 1) % data.length;
            setIndex(next);
            listRef.current?.scrollToOffset({
                offset: OFFSETS[next],
                animated: true,
            });
        }, intervalMs);
        return () => clearInterval(t);
    }, [index, intervalMs, data.length, OFFSETS]);

    const onSnapSync = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        // 가장 가까운 오프셋을 찾아 인덱스 맞춤
        const nearest = OFFSETS.reduce((best, off, i) => {
            const d = Math.abs(off - x);
            return d < best.d ? { i, d } : best;
        }, { i: 0, d: Infinity }).i;
        if (nearest !== index) setIndex(nearest);
    };
    const renderItem = ({ item, index: i }) => (
        <Pressable
            style={[
                styles.card,
                { marginRight: i === shuffled.length - 1 ? 0 : CARD_GAP },
            ]}
            android_ripple={{ color: "#f2f2f2" }}
            onPress={() => Linking.openURL(item.link)}
            hitSlop={6}
        >
            <Image source={item.image} style={styles.thumb} />
            <View style={{ flex: 1 }}>
                <View style={styles.tagRow}>
                    <Text style={styles.tag}>{item.tag}</Text>
                    <Feather name="volume-2" size={14} color="#FF685E" />
                </View>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
            </View>
        </Pressable>
    );

    // 스와이프 후 보이는 카드 인덱스 동기화
    const onMomentumEnd = (e) => {
        const off = e.nativeEvent.contentOffset.x;
        const viewIdx = Math.round(off / (ITEM_WIDTH + CARD_GAP));
        setIndex(viewIdx);
    };

    return (
        <View>
          <FlatList
            ref={listRef}
            data={data}
            horizontal
            renderItem={({ item, index: i }) => (
              <Pressable
                style={[styles.card, { marginRight: i === data.length - 1 ? 0 : CARD_GAP }]}
                onPress={() => Linking.openURL(item.link)}
              >
                <Image source={item.image} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <View style={styles.tagRow}>
                    <Text style={styles.tag}>{item.tag}</Text>
                    <Feather name="volume-2" size={14} color="#FF685E" />
                  </View>
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(it) => String(it.id)}
            // ✅ 정확 스냅: offsets 배열 지정
            snapToOffsets={OFFSETS}
            snapToAlignment="start"
            disableIntervalMomentum
            decelerationRate="fast"
            bounces={false}
            overScrollMode="never"
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={{ paddingHorizontal: H_PADDING }}
            showsHorizontalScrollIndicator={false}
            // 스크롤 후 인덱스 동기화 (드래그/모멘텀 모두)
            onScrollEndDrag={onSnapSync}
            onMomentumScrollEnd={onSnapSync}
            // getItemLayout도 동일 기준으로
            getItemLayout={(_, i) => ({
              length: ITEM_WIDTH + CARD_GAP,
              offset: OFFSETS[i],
              index: i,
            })}
            removeClippedSubviews
            scrollEventThrottle={16}
          />
    
          <View style={styles.dots}>
            {data.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </View>
      );
    }

    const styles = StyleSheet.create({
        card: {
          width: ITEM_WIDTH,
          flexDirection: "row",
          gap: 12,
          padding: 14,
          backgroundColor: "#fff",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#eee",
        },
        thumb: { width: 80, height: 80, borderRadius: 10, resizeMode: "cover" },
        tagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
        tag: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: "#FFF1F1", color: "#FF685E",fontWeight:800 },
        title: { fontSize: 15, fontWeight: "700", color: "#222" },
        body: { fontSize: 13, color: "#666", marginTop: 4 },
        dots: { flexDirection: "row", justifyContent: "center", marginTop: 6, gap: 6 },
        dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: "#E5E5EA" },
        dotActive: { width: 18, backgroundColor: "#FF685E", borderRadius: 6 },
      });