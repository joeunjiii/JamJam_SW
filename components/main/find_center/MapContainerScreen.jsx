import React from "react";
import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, Feather } from "@expo/vector-icons";
import { styles, COLORS } from "./style/mapContainer.styles";

export default function MapContainerScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
                </Pressable>

                <Image
                    source={require("../../../assets/main/namelogo.png")}
                    style={{ width: 100, height: 40, resizeMode: "contain" }}
                />

                <Feather name="bell" size={20} color={COLORS.text} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.containerCard}>
                    <View style={styles.mapWrap}>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: 37.5665,
                                longitude: 126.9780,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            showsMyLocationButton={false}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
