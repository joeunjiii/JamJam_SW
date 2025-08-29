import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL2;

export async function requestFilterPolicies(payload) {
  try {
    console.log("🌍 API_BASE:", API_BASE);
    const res = await axios.post(`${API_BASE}/policy/recommend`, payload);
    return res.data;
  } catch (err) {
    console.error("❌ 정책 추천 API 오류:", err);
    return [];
  }
}
