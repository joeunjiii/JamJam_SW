// components/login/service/auth.js
import { storage } from "./storage";

export async function getAccessToken() {
    const token = await storage.getItem("accessToken");
    if (!token || token === "null" || token === "undefined") return null;
    return token;
}

export async function getAuthHeaders() {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
