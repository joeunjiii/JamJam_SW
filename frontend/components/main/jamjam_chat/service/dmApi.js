// components/main/jamjam_chat/service/dmApi.js
import { getAuthHeaders } from "../../../login/service/auth";
import { storage } from "../../../login/service/storage"; // userId 읽기용

const RAW =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8082";

const API_BASE = `${RAW.replace(/\/$/, "")}/api/dm`;

export const dmApi = {
    async getMyUserId() {
        // 로그인시 저장해둔 userId를 사용 (문자면 숫자로 변환)
        const id = await storage.getItem("userId");
        return id ? Number(id) : null;
    },

    // 스레드 목록 가져오기
    async getThreads() {
        const res = await fetch(`${API_BASE}/threads`, {
            headers: await getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch threads");
        return res.json(); // [{threadId, otherUserId, otherUserNickname, otherUserProfileImage, lastMessage, lastMessageTime, unreadCount}]
    },

    // 최근 메시지 (최신순 DESC로 limit개)
    async loadRecent(threadId, limit = 50) {
        const res = await fetch(`${API_BASE}/${threadId}/recent?limit=${limit}`, {
            headers: await getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch recent messages");
        return res.json(); // [{messageId, threadId, senderId, body, fileUrl, createdAt}]
    },

    // 특정 메시지 이전(과거) 로드
    async loadBefore(threadId, beforeMessageId, limit = 50) {
        const url = `${API_BASE}/${threadId}/before?beforeMessageId=${beforeMessageId}&limit=${limit}`;
        const res = await fetch(url, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch older messages");
        return res.json();
    },

    // 메시지 전송(서버가 저장 후 /topic/thread.{id}으로 브로드캐스트)
    async sendMessage(threadId, { body = null, fileUrl = null }) {
        const res = await fetch(`${API_BASE}/${threadId}/messages`, {
            method: "POST",
            headers: {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ body, fileUrl }),
        });
        if (!res.ok) throw new Error("Failed to send message");
        return res.json(); // 저장된 메시지 DTO
    },

    // 닉네임으로 스레드 만들기 (검색 -> 첫 결과 아이디로 스레드 생성)
    // 서버에 /api/dm/search?query= 가 이미 있다면 사용. 없다면 닉네임=정확히 매칭 API를 따로 쓰면 됨.
    async findUsers(query) {
        const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`, {
            headers: await getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to search users");
        return res.json(); // [{userId, nickname, profileImageUrl, isOnline}]
    },

    async createThreadByUserId(otherUserId) {
        const res = await fetch(`${API_BASE}/thread?otherUserId=${otherUserId}`, {
            method: "POST",
            headers: await getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to create/find thread");
        return res.json(); // {threadId, user1Id, user2Id, createdAt}
    },

    async createThreadByNickname(nickname) {
        const list = await this.findUsers(nickname);
        // 우선순위: 1) 정확히 같은 닉네임 2) 첫 번째 결과
        let target = list.find((u) => u.nickname === nickname) || list[0];
        if (!target) throw new Error("User not found");
        return this.createThreadByUserId(target.userId);
    },
};
