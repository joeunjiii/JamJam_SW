// components/main/jamjam_chat/service/dmApi.js
import { getAuthHeaders } from "../../../login/service/auth";

// API BASE
const RAW =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://43.201.211.116:8082";
const API_BASE = `${RAW.replace(/\/$/, "")}/api/dm`;

async function fetchJson(url, opts = {}) {
    const res = await fetch(url, opts);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[dmApi] ${res.status} ${url} ->`, text);
        throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
}

export const dmApi = {
    async getThreads() {
        return fetchJson(`${API_BASE}/threads`, {
            headers: await getAuthHeaders(),
        });
    },

    async getRecent(threadId, limit = 50) {
        return fetchJson(`${API_BASE}/${threadId}/recent?limit=${limit}`, {
            headers: await getAuthHeaders(),
        });
    },

    async getBefore(threadId, beforeMessageId, limit = 50) {
        return fetchJson(
            `${API_BASE}/${threadId}/before?beforeMessageId=${beforeMessageId}&limit=${limit}`,
            { headers: await getAuthHeaders() }
        );
    },

    async sendMessage(threadId, payload) {
        return fetchJson(`${API_BASE}/${threadId}/messages`, {
            method: "POST",
            headers: {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    },

    async findUsers(query) {
        return fetchJson(`${API_BASE}/search?query=${encodeURIComponent(query)}`, {
            headers: await getAuthHeaders(), // 검색을 공개로 열었으면 이 줄 제거 가능
        });
    },

    // ✅ 새로 추가: 닉네임으로 DM 스레드 생성/조회
    async startByNickname(nickname) {
        return fetchJson(`${API_BASE}/start`, {
            method: "POST",
            headers: {
                ...(await getAuthHeaders()), // /api/dm/start 는 인증 필요
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nickname }),
        });
    },
};
