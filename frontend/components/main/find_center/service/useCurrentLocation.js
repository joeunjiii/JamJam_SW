import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("위치 권한이 거부되었습니다.");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        console.log("현재 위치:", loc.coords);
        setLocation(loc.coords); // { latitude, longitude }
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return { location, error };
}
