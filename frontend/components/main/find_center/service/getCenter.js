// service/getCenter.js
import axios from "axios";

// 가까운 센터 목록 가져오기
export async function getNearestCenters(lat, lng) {
    //   try {
    //     const res = await axios.get(`http://localhost:8080/api/centers/nearest`, {
    //       params: { lat, lng },
    //     });
    //     return res.data;
    //   } catch (err) {
    //     console.error("getNearestCenters error:", err);
    //     return [];
    //   }

    // 지금은 mock 데이터
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { 
                  id: "c1", 
                  name: "강남구 육아 종합지원센터", 
                  addr: "서울특별시 강남구 삼성로 72길 7(대치동)",
                  lat: 37.5026369723535, 
                  lng: 127.059742934652, 
                },
                { 
                  id: "c2", 
                  name: "광주동구육아종합지원센터", 
                  addr: "광주 동구 지원로 31-9 3층",
                  lat: 35.1253005996901, 
                  lng: 126.935176655008,
                },
                { 
                  id: "c3", 
                  name: "광주서구육아종합지원센터", 
                  addr: "광주 서구 상무자유로 73 2층",
                  lat: 35.15221868, 
                  lng: 126.842220211165, 
                },
            ]);
        }, 2000);
    });
}
