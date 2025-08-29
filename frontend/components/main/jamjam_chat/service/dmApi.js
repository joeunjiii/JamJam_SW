// components/chat/service/dmApi.js
import { getAuthHeaders } from "./auth";

const RAW_BASE =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8082";

const API_BASE = (RAW_BASE || "").replace(/\/$/, "") + "/api";

export const dmApi = {
    async getOrCreateThread(otherUserId /* me는 JWT로 식별 */) {
        const headers = { "Content-Type": "application/json", ...(await getAuthHeaders()) };

        const res = await fetch(`${API_BASE}/dm/thread/${otherUserId}`, {
            method: "POST",
            headers,
        });
        if (!res.ok) throw new Error(`Thread API ${res.status}`);
        return await res.json(); // {threadId, otherUserId, me, createdAt}
    },

    async loadRecent(threadId, size = 50) {
        const headers = { "Content-Type": "application/json", ...(await getAuthHeaders()) };

        const res = await fetch(`${API_BASE}/dm/thread/${threadId}/recent?size=${size}`, {
            method: "GET",
            headers,
        });
        if (!res.ok) throw new Error(`Recent API ${res.status}`);
        return await res.json(); // [{messageId,threadId,senderId,body,fileUrl,createdAt}]
    },
};
