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
                  name: "대덕구 다함께돌봄센터",
                  addr: "대전광역시 대덕구 동춘당로 94번길 11 송촌동 복지센터 5층",
                  lat: 36.3657087811662,
                  lng: 127.439858454071,
                },
                { 
                  id: "c2", 
                  name: "도안동 행복복지센터", 
                  addr: "대전광역시 서구 도안동 1097번지 도안동행정복지센터내, 2~3층",
                  lat: 36.3236684639183, 
                  lng: 127.346743738544,
                },
                { 
                  id: "c3", 
                  name: "청주시 육아종합지원 센터", 
                  addr: "충청북도 청주시 청원구 내덕로 13-2(내덕동)",
                  lat: 36.6562578302769, 
                  lng: 127.482089582495, 
                },
            ]);
        }, 2000);
    });
}
