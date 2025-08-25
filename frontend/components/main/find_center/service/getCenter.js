// service/getCenter.js
import axios from "axios";

// 가까운 센터 목록 가져오기
export async function getNearestCenters(lat, lng) {
    //   try {
    //     // ✅ 백엔드 API 주소 (나중에 환경변수/상수로 관리)
    //     const res = await axios.get(`http://localhost:8080/api/centers/nearest`, {
    //       params: { lat, lng },
    //     });
    //     return res.data;  // [{id, name, addr, dist}, ...]
    //   } catch (err) {
    //     console.error("getNearestCenters error:", err);
    //     return [];
    //   }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: "c1", name: "서울특별시 육아종합지원센터", addr: "서울 마포구 서강로 75-16" },
                { id: "c2", name: "강남보육정보센터", addr: "서울 용산구 청파로 345" },
                { id: "c3", name: "광주서구육아종합지원센터", addr: "광주광역시 서구 상무자유로 73" },
            ]);
        }, 2000);
    });
}
