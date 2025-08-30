import React from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Image,
    StyleSheet
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, colors } from "./style/PolicyCurationResult.styles";

// 더미 정책 데이터
const DUMMY_POLICIES = [
    {
        id: 1,
        title: "출생가정 축하 상생카드 50만 원 지원",
        description: "광주광역시에서 출생신고 20일 이내 1회 이용 후 출생아와 부모가 함께 사진 3장에서 신청 가능 시 50만 원을 지원하여 아이들에게 경제적 양육부담감을 기본으로 지원합니다.",
        image: require("../../../assets/main/policycuration/poster1.png"), // 실제 이미지 경로로 변경
        category: "출산지원"
    },
    {
        id: 2,
        title: "2025년 임신부 멀티한 패키지 지원사업",
        description: "광주광역시 내 300만 이하 초산임산부에서 진행하는 영양제 지원개시에서 임산부 패키지를 인원별 패키지 제고, 임신부 목욕, 임신부 우리미, 부모-노우하우 등이 포함됩니다.",
        image: require("../../../assets/main/policycuration/poster2.png"), // 실제 이미지 경로로 변경
        category: "임신지원"
    },
    {
        id: 3,
        title: "임산부 직장맘을 위한 맘가정원법 지원제도",
        description: "광주광역시 관내 100만 이하 시설임산부에서 원하는 영양제 직장맘에서 고용육아지원금을 지원합니다. (출생아 2층 중앙육아모든 간식 추가비 100만 원 지원)",
        image: require("../../../assets/main/policycuration/poster3.png"), // 실제 이미지 경로로 변경
        category: "직장맘지원"
    }
];

export default function PolicyCurationResult({ navigation, route }) {
    const { answers } = route?.params || {};

    const PolicyCard = ({ policy }) => (
        <View style={styles.policyCard}>
            <View style={styles.cardContent}>
                <Image source={policy.image} style={styles.policyImage} />
                <View style={styles.policyTextContent}>
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{policy.category}</Text>
                    </View>
                    <Text style={styles.policyTitle}>{policy.title}</Text>
                    <Text style={styles.policyDescription} numberOfLines={4}>
                        {policy.description}
                    </Text>
                    <Pressable style={styles.detailButton}>
                        <Text style={styles.detailButtonText}>자세히 보기</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                        <Ionicons name="chevron-back" size={26} color={colors.primary} />
                    </Pressable>

                    <Image
                        source={require("../../../assets/main/namelogo.png")}
                        style={{ width: 100, height: 40, resizeMode: "contain" }}
                    />

                    <Feather name="bell" size={20} color={colors.text} />
                </View>



                <View style={styles.resultHeader}>
                    <Image
                        source={require("../../../assets/main/policycuration/eye.png")} // 실제 이미지 경로로 변경
                        style={styles.eyesImage}
                    />
                    <Text style={styles.resultTitle}>수달프린스님이</Text>
                    <Text style={styles.resultSubtitle}>
                        신청할 수 있는 <Text style={styles.highlightText}>3건</Text>입니다
                    </Text>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Policy List */}
                    <View style={styles.policiesContainer}>
                        {DUMMY_POLICIES.map((policy) => (
                            <PolicyCard key={policy.id} policy={policy} />
                        ))}
                    </View>

                    {/* Spacer */}
                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}