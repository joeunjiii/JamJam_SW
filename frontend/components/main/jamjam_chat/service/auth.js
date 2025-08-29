// components/chat/service/auth.js
import { storage } from "../../../login/service/storage"; // <= 너의 storage 경로 맞춰 수정

export async function getAccessToken() {
    const token = await storage.getItem("accessToken");
    if (!token || token === "null" || token === "undefined") return null;
    return token;
}

export async function getAuthHeaders() {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
