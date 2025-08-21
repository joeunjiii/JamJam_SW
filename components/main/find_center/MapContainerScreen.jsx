import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Pressable, Image, ScrollView, Text } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { styles, COLORS } from "./style/mapContainer.styles";
import useCurrentLocation from "./hooks/useCurrentLocation";
import useNearestCenters from "./hooks/useNearestCenters";

export default function MapContainerScreen({ navigation }) {
    const KAKAO_KEY = Constants.expoConfig.extra.kakaoJavascriptKey;
    const webRef = useRef(null);

    const { location, loading, error } = useCurrentLocation();

    // 전체 센터 목록 (좌표가 있으면 사용, 없으면 주소 기반)
    const centers = [
        { id: "c1", name: "서울특별시 육아종합지원센터", addr: "서울 마포구 서강로 75-16" },
        { id: "c2", name: "강남보육정보센터", addr: "서울 용산구 청파로 345" },
        { id: "c3", name: "광주서구육아종합지원센터", addr: "광주광역시 서구 상무자유로 73" },
        { id: "c4", name: "지원1동행정복지센터", addr: "광주 동구 지원로 31-9" },
    ];

    // 내 위치 + 가까운 센터 계산
    const nearestCenters = useNearestCenters(location, centers);

    // READY 이후 nearestCenters 갱신 시 WebView로 재전송
    useEffect(() => {
        if (webRef.current && webRef.current.__isReady && location) {
            console.log('[Map] nearestCenters updated:', nearestCenters);
            const top3 = nearestCenters.length > 0 ? nearestCenters : [];
            webRef.current.postMessage(
                JSON.stringify({
                    type: "INIT_DATA",
                    user: { lat: location.latitude, lng: location.longitude },
                    centers: top3,
                })
            );
        }
    }, [nearestCenters, location]);

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services"></script>
       <style>
          html, body, #map { width:100%; height:100%; margin:0; padding:0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
  var mapContainer = document.getElementById('map');
  var mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 3
  };
  var map = new kakao.maps.Map(mapContainer, mapOption);
  var userMarker;

  // RN 측으로 준비 완료 신호 전송 → RN이 INIT_DATA를 보내도록 트리거
  if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
  }

  function handleRNMessage(e) {
    try {
      var raw = e && (e.data || (e.detail && e.detail.data));
      if (!raw) return;
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

      if (data && data.type === 'INIT_DATA') {
        var locPosition = new kakao.maps.LatLng(data.user.lat, data.user.lng);
        if (userMarker) userMarker.setMap(null);
        userMarker = new kakao.maps.Marker({ map: map, position: locPosition });
        map.setCenter(locPosition);

        data.centers.forEach(function(c) {
          var geocoder = new kakao.maps.services.Geocoder();
          // lat/lng가 있으면 바로 사용, 없으면 주소 지오코딩
          if (typeof c.lat === 'number' && typeof c.lng === 'number') {
            var coords = new kakao.maps.LatLng(c.lat, c.lng);
            var marker = new kakao.maps.Marker({ map: map, position: coords });
            var infowindow = new kakao.maps.InfoWindow({
              content: "<div style='padding:5px;font-size:13px;'>" + c.name + "</div>"
            });
            kakao.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });
          } else if (c.addr) {
            geocoder.addressSearch(c.addr, function(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                var coords2 = new kakao.maps.LatLng(result[0].y, result[0].x);
                var marker2 = new kakao.maps.Marker({ map: map, position: coords2 });
                var infowindow2 = new kakao.maps.InfoWindow({
                  content: "<div style='padding:5px;font-size:13px;'>" + c.name + "</div>"
                });
                kakao.maps.event.addListener(marker2, 'click', function() {
                  infowindow2.open(map, marker2);
                });
              }
            });
          }
        });
      }
    } catch (err) {
      console.error('Parse error:', err);
    }
  }

  // iOS/modern
  window.addEventListener('message', handleRNMessage);
  // Android/legacy compatibility
  document.addEventListener('message', handleRNMessage);
</script>
      </body>
    </html>
  `;

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
                        <WebView
                            ref={webRef}
                            source={{ html }}
                            style={{ flex: 1, zIndex: 0 }}
                            javaScriptEnabled
                            domStorageEnabled
                            androidLayerType="software"
                            onMessage={(e) => {
                                const msg = JSON.parse(e.nativeEvent.data);
                                if (msg.type === "READY") {
                                    webRef.current.__isReady = true;
                                    if (location && webRef.current) {
                                        const top3 = nearestCenters.length > 0 ? nearestCenters : [];
                                        console.log('[Map] sending INIT_DATA top3:', top3);
                                        webRef.current.postMessage(JSON.stringify({
                                            type: "INIT_DATA",
                                            user: { lat: location.latitude, lng: location.longitude },
                                            centers: top3,
                                        }));
                                    }
                                }
                            }}
                        />
                        {/* 오버레이: 가까운 센터 3개 (mapWrap 내부로 복귀) */}
                        <View style={styles.overlayCardList} pointerEvents="box-none">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {nearestCenters.map((c) => (
                                    <Pressable key={c.id} style={styles.card}>
                                        <Text style={styles.cardTitle}>{c.name}</Text>
                                        <Text style={styles.cardAddr}>{c.addr}</Text>
                                        <Text style={styles.cardDist}>
                                            {c.distance.toFixed(1)} km
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
