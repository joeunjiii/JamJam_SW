// components/main/jamjam_chat/service/dmApi.js
import { getAuthHeaders } from "../../../login/service/auth";
import { storage } from "../../../login/service/storage"; // userId 읽기용

const RAW =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8082";

const API_BASE = `${RAW.replace(/\/$/, "")}/api/dm`;

// 에러 응답 처리 헬퍼 함수
async function handleResponse(response, errorMessage) {
    if (!response.ok) {
        let errorDetail = '';
        try {
            // 서버에서 JSON 에러 응답을 보내는 경우
            const errorData = await response.json();
            errorDetail = errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch {
            // JSON이 아닌 경우 텍스트로 읽기
            try {
                errorDetail = await response.text() || `HTTP ${response.status}`;
            } catch {
                errorDetail = `HTTP ${response.status}`;
            }
        }

        console.error(`[dmApi] ${errorMessage}:`, {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            error: errorDetail
        });

        // 401/403 인증 에러의 경우 특별 처리
        if (response.status === 401 || response.status === 403) {
            throw new Error(`Authentication failed: ${errorDetail}`);
        }

        throw new Error(`${errorMessage}: ${errorDetail}`);
    }
    return response.json();
}

// 디버깅용 로그 함수
function debugLog(methodName, url, headers) {
    console.log(`[dmApi] ${methodName}`, {
        url,
        hasAuth: !!(headers && headers.Authorization),
        timestamp: new Date().toISOString()
    });
}

export const dmApi = {
    async getMyUserId() {
        // 로그인시 저장해둔 userId를 사용 (문자면 숫자로 변환)
        const id = await storage.getItem("userId");
        const userId = id ? Number(id) : null;
        console.log(`[dmApi] getMyUserId: ${userId}`);
        return userId;
    },

    // 스레드 목록 가져오기
    async getThreads() {
        const headers = await getAuthHeaders();
        const url = `${API_BASE}/threads`;

        debugLog('getThreads', url, headers);

        const res = await fetch(url, { headers });
        return handleResponse(res, "Failed to fetch threads");
    },

    // 최근 메시지 (최신순 DESC로 limit개)
    async loadRecent(threadId, limit = 50) {
        const headers = await getAuthHeaders();
        const url = `${API_BASE}/${threadId}/recent?limit=${limit}`;

        debugLog('loadRecent', url, headers);

        const res = await fetch(url, { headers });
        return handleResponse(res, "Failed to fetch recent messages");
    },

    // 특정 메시지 이전(과거) 로드
    async loadBefore(threadId, beforeMessageId, limit = 50) {
        const headers = await getAuthHeaders();
        const url = `${API_BASE}/${threadId}/before?beforeMessageId=${beforeMessageId}&limit=${limit}`;

        debugLog('loadBefore', url, headers);

        const res = await fetch(url, { headers });
        return handleResponse(res, "Failed to fetch older messages");
    },

    // 메시지 전송(서버가 저장 후 /topic/thread.{id}으로 브로드캐스트)
    async sendMessage(threadId, { body = null, fileUrl = null }) {
        const headers = {
            ...(await getAuthHeaders()),
            "Content-Type": "application/json",
        };
        const url = `${API_BASE}/${threadId}/messages`;

        debugLog('sendMessage', url, headers);

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ body, fileUrl }),
        });
        return handleResponse(res, "Failed to send message");
    },

    // 사용자 검색
    async findUsers(query) {
        if (!query || query.trim() === '') {
            throw new Error("Search query cannot be empty");
        }

        const headers = await getAuthHeaders();
        const url = `${API_BASE}/search?query=${encodeURIComponent(query.trim())}`;

        debugLog('findUsers', url, headers);

        const res = await fetch(url, { headers });
        return handleResponse(res, "Failed to search users");
    },

    async createThreadByUserId(otherUserId) {
        if (!otherUserId) {
            throw new Error("otherUserId is required");
        }

        const headers = await getAuthHeaders();
        const url = `${API_BASE}/thread?otherUserId=${otherUserId}`;

        debugLog('createThreadByUserId', url, headers);

        const res = await fetch(url, {
            method: "POST",
            headers,
        });
        return handleResponse(res, "Failed to create/find thread");
    },

    async createThreadByNickname(nickname) {
        if (!nickname || nickname.trim() === '') {
            throw new Error("Nickname cannot be empty");
        }

        try {
            console.log(`[dmApi] createThreadByNickname: searching for "${nickname}"`);
            const list = await this.findUsers(nickname.trim());

            console.log(`[dmApi] createThreadByNickname: found ${list.length} users`, list);

            // 우선순위: 1) 정확히 같은 닉네임 2) 첫 번째 결과
            let target = list.find((u) => u.nickname === nickname.trim()) || list[0];

            if (!target) {
                throw new Error(`User with nickname "${nickname}" not found`);
            }

            console.log(`[dmApi] createThreadByNickname: selected user`, target);
            return this.createThreadByUserId(target.userId);
        } catch (error) {
            console.error(`[dmApi] createThreadByNickname failed for "${nickname}":`, error);
            throw error;
        }
    },

    async startByNickname(nickname) {
        if (!nickname || nickname.trim() === '') {
            throw new Error("Nickname cannot be empty");
        }

        const headers = {
            ...(await getAuthHeaders()),
            "Content-Type": "application/json",
        };
        const url = `${API_BASE}/start`;

        debugLog('startByNickname', url, headers);

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ nickname: nickname.trim() }),
        });

        if (!res.ok) {
            const text = await
 res.text().catch(() => "");
            console.error(`[dmApi] startByNickname ${res.status} ->`, text);

            // 401/403 인증 에러의 경우 특별 처리
            if (res.status === 401 || res.status === 403) {
                throw new Error(`Authentication failed: ${text}`);
            }

            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        return res.json(); // { threadId, user1Id, user2Id, createdAt }
    },

    // 인증 상태 확인 헬퍼 메서드 추가
    async checkAuth() {
        try {
            const headers = await getAuthHeaders();
            const hasAuth = !!(headers && headers.Authorization);
            const userId = await this.getMyUserId();

            console.log(`[dmApi] Auth check:`, {
                hasAuthHeader: hasAuth,
                userId: userId,
                authHeaderLength: headers?.Authorization?.length || 0
            });

            return { hasAuth, userId };
        } catch (error) {
            console.error(`[dmApi] Auth check failed:`, error);
            return { hasAuth: false, userId: null };
        }
    }
};