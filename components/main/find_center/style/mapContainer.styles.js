import { Dimensions, StyleSheet } from "react-native";


const { height: screenHeight } = Dimensions.get("window");


export const COLORS = {  
    bg: "#FFB3BA",
    white: "#ffffff",
    text: "#1f2937",
    primary: "#ff6b6b",
    border: "#f5f5f5",
};
const R = { headerH: 62, r32: 32, pad: 18 };

export const styles = StyleSheet.create({
    vars: { colors: COLORS, radius: R },

    safe: { flex: 1, backgroundColor: COLORS.bg },

    // === Header ===
    header: {
        height: R.headerH,
        paddingHorizontal: R.pad,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        padding: 4,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerRight: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitleImg: {
        width: 100,
        height: 40,
        resizeMode: "contain",
    },

    // === Content ===
    content: { flex: 1 },

    containerCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: R.r32,
        borderTopRightRadius: R.r32,
        padding: R.pad,
        minHeight: screenHeight * 1.2,   // 기기 화면의 120% 길이
    },

    mapWrap: {
        height: "65%",   
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: COLORS.border,
    },

    map: { flex: 1 },
});
