import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";

const KAKAO_JS_KEY = Constants.expoConfig.extra.kakaoJavascriptKey;
const KAKAO_REST_KEY = Constants.expoConfig.extra.kakaoRestApiKey || KAKAO_JS_KEY;

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getCoordsFromCenter(center) {
  // If coordinates already exist, use them directly
  if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
    return { lat: center.lat, lng: center.lng };
  }

  // Otherwise, try geocoding by address
  if (center && center.addr) {
    const res = await axios.get(
      "https://dapi.kakao.com/v2/local/search/address.json",
      {
        params: { query: center.addr },
        headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
      }
    );
    if (res.data.documents.length > 0) {
      const { x, y } = res.data.documents[0];
      return { lat: parseFloat(y), lng: parseFloat(x) };
    }
  }

  return null;
}

export default function useNearestCenters(myLocation, centers) {
  const [nearest, setNearest] = useState([]);

  useEffect(() => {
    if (!myLocation) return;

    (async () => {
      const centersWithCoords = await Promise.all(
        centers.map(async (c) => {
          const coords = await getCoordsFromCenter(c);
          if (!coords) return null;
          const lat = typeof coords.lat === 'string' ? parseFloat(coords.lat) : coords.lat;
          const lng = typeof coords.lng === 'string' ? parseFloat(coords.lng) : coords.lng;
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
          return { ...c, lat, lng };
        })
      );

      console.log('[nearest] myLocation:', myLocation);
      console.log('[nearest] centersWithCoords:', centersWithCoords);
      if (!KAKAO_REST_KEY) {
        console.warn('[nearest] Kakao REST key missing. Set EXPO_PUBLIC_KAKAO_REST_API_KEY');
      }

      const centersWithDist = centersWithCoords
        .filter(Boolean)
        .map((c) => ({
          ...c,
          distance: getDistance(
            myLocation.latitude,
            myLocation.longitude,
            c.lat,
            c.lng
          ),
        }));

      console.log('[nearest] centersWithDist:', centersWithDist);

      setNearest(
        centersWithDist.sort((a, b) => a.distance - b.distance).slice(0, 3)
      );

      console.log('[nearest] top3:', centersWithDist
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3));
    })();
  }, [myLocation, centers]);

  return nearest;
}
