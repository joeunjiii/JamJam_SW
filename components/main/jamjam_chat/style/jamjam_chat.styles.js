// jamjam_chat.styles.js
import { StyleSheet, Dimensions } from 'react-native';


// 색상 상수
export const COLORS = {
    bg: '#FFB3BA',      // 상단 배경
    primary: '#ff6b6b', // 버튼/배지
    white: '#ffffff',

    gray50: '#f9fafb',
    gray100: '#f5f5f5',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray800: '#1f2937',

    pink50: '#fef2f2',
};

// 레이아웃 상수
export const LAYOUT = {
    HEADER_HEIGHT: 56,
    BORDER_RADIUS: { xl: 32 },
    SPACING: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 10,
        xl: 20,
    },
    AVATAR_SIZE: 48,
    FAB_SIZE: 56,
};

// 그림자
const SHADOW = {
    medium: {
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
};

// 메인 스타일
export const styles = StyleSheet.create({
    // === Container ===
    container: {
        flex: 1,
        backgroundColor: COLORS.bg, // 상단 배경
    },

    // === Header ===
    header: {
        height: LAYOUT.HEADER_HEIGHT,
        paddingHorizontal: LAYOUT.SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: { padding: LAYOUT.SPACING.xs },
    headerLogo: { width: 100, height: 40, resizeMode: 'contain' },

    // === Content ===
    content: {
        flex: 1,
    },

    // ✅ 곡선 박스 (검색 + 리스트 감쌈)
    bgCurve: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: LAYOUT.BORDER_RADIUS.xl,
        borderTopRightRadius: LAYOUT.BORDER_RADIUS.xl,
        paddingTop: LAYOUT.SPACING.lg,
        paddingHorizontal: LAYOUT.SPACING.lg,
        marginBottom: -50,
    },

    // === Search Bar ===
    searchContainer: {
        marginBottom: LAYOUT.SPACING.md,
    },
    searchWrapper: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: LAYOUT.SPACING.md,
        top: LAYOUT.SPACING.sm,
        zIndex: 1,
    },
    searchInput: {
        backgroundColor: COLORS.gray100,
        borderRadius: 20,
        paddingHorizontal: LAYOUT.SPACING.lg,
        paddingVertical: LAYOUT.SPACING.sm,
        paddingLeft: 40,
        fontSize: 14,
        color: COLORS.gray800,
    },


    // === Avatar ===
    avatarContainer: {
        width: LAYOUT.AVATAR_SIZE,
        height: LAYOUT.AVATAR_SIZE,
        borderRadius: LAYOUT.AVATAR_SIZE / 2,
        backgroundColor: COLORS.pink50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: LAYOUT.SPACING.md,
    },
    avatar: { fontSize: 20 },
    avatarImage: {
        width: LAYOUT.AVATAR_SIZE * 0.9,
        height: LAYOUT.AVATAR_SIZE * 0.9,
    },

    // === Chat List ===
    chatList: { flex: 1 },


    // === Chat Content ===
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: LAYOUT.SPACING.lg,
        paddingVertical: LAYOUT.SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    meta: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start', // 시간은 위, 배지는 아래로
        minWidth: 64,                 // 폭 고정해서 레이아웃 흔들림 방지
        marginLeft: LAYOUT.SPACING.sm,
    },
    chatContent: {
        flex: 1,
        // 메타 컬럼과 겹치지 않게 살짝 여유
        paddingRight: LAYOUT.SPACING.sm,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: LAYOUT.SPACING.xs,
    },
    chatName: { fontSize: 16, fontWeight: '600', color: COLORS.gray800, marginBottom: 5 },
    chatTime: {
        fontSize: 12,
        color: COLORS.gray500,
        marginBottom: 4, // 아래에 배지가 오면 간격 확보
    },
    lastMessage: { fontSize: 14, color: COLORS.gray600 },

    // === Unread Badge ===
    unreadBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2, // 시간과 살짝 간격
        paddingHorizontal: 6, // 10+ 개수 대비 가변폭
    },
    unreadCount: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },

    // === FAB ===
    fab: {
        position: 'absolute',
        right: LAYOUT.SPACING.xl,
        bottom: LAYOUT.SPACING.xl,
        width: LAYOUT.FAB_SIZE,
        height: LAYOUT.FAB_SIZE,
        borderRadius: LAYOUT.FAB_SIZE / 2,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOW.medium,
    },
});
