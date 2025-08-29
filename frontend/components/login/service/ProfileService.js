import { storage } from "./storage";

const RAW_BASE =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://43.201.211.116:8082";

const API_BASE_URL = (RAW_BASE || "").replace(/\/$/, "") + "/api";

class ProfileService {
    async getAuthHeadersOrThrow() {
        const token = await storage.getItem("accessToken");
        console.log("[Auth] accessToken from storage:", token);
        if (!token || token === "null" || token === "undefined") {
            throw new Error("로그인이 필요합니다. (토큰 없음)");
        }
        return { Authorization: `Bearer ${token}` };
    }

    async getHeadersOptionalAuth() {
        const token = await storage.getItem("accessToken");
        const base = { "Content-Type": "application/json" };
        if (token && token !== "null" && token !== "undefined") {
            return { ...base, Authorization: `Bearer ${token}` };
        }
        return base;
    }

    async getProfile(userId) {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: "GET",
            headers: await this.getHeadersOptionalAuth(),
        });
        if (res.status === 404) throw new Error("프로필을 찾을 수 없습니다.");
        if (res.status === 401) throw new Error("로그인이 필요합니다. (401)");
        if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`);
        return res.json();
    }

    // ✅ 수정된 saveProfile - isEdit 파라미터 추가
    async saveProfile(userId, profileData, isEdit = false) {
        const headers = {
            "Content-Type": "application/json",
            ...(await this.getAuthHeadersOrThrow()),
        };

        // POST와 PUT 모두 동일한 URL 패턴 사용
        const method = isEdit ? "PUT" : "POST";
        const url = `${API_BASE_URL}/profile/${userId}`;

        // POST와 PUT 모두 동일한 body 구성 (userId는 URL에 있으므로 body에서 제외)
        const requestData = this.convertToApiFormat(profileData);
        const body = JSON.stringify(requestData);

        console.log(`${method} 요청 - URL: ${url}, JSON:`, body);

        const res = await fetch(url, {
            method,
            headers,
            body,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 409) throw new Error("이미 사용 중인 닉네임입니다.");
            if (res.status === 401) throw new Error("로그인이 필요합니다. (401)");
            throw new Error(errorData.message || `저장 실패: ${res.status}`);
        }
        return res.json();
    }

    async deleteProfile(userId) {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: "DELETE",
            headers: await this.getAuthHeadersOrThrow(),
        });
        if (res.status === 401) throw new Error("로그인이 필요합니다. (401)");
        if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
    }

    async hasProfile(userId) {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}/exists`, {
            method: "GET",
            headers: await this.getHeadersOptionalAuth(),
        });
        if (res.status === 401) return false;
        if (!res.ok) throw new Error(`확인 실패: ${res.status}`);
        return res.json();
    }

    convertToApiFormat(profileData) {
        const apiData = {
            nickname: profileData.nickname,
            gender: profileData.gender,
            // ✅ 백엔드 @JsonProperty("parentingStatus")에 맞춤
            parentingStatus: profileData.status, // JSON 키를 parentingStatus로 변경
            dueDate: profileData.dueDate ? this.formatDateForApi(profileData.dueDate) : null,
            profileImageUrl: profileData.profileImageUrl || null,
            children: [],
        };

        if (profileData.children && profileData.children.length > 0) {
            apiData.children = profileData.children
                .map((child) => ({
                    name: child.name,
                    birthDate: child.birth ? this.formatDateForApi(new Date(child.birth)) : null,
                    gender: child.gender,
                }))
                .filter((child) => child.name && child.birthDate);
        }
        return apiData;
    }

    convertFromApiFormat(apiData) {
        return {
            userId: apiData.userId || null,
            nickname: apiData.nickname || "",
            gender: apiData.gender || "남성",
            // ✅ ResponseDTO에서는 parentingStatus 필드 사용
            status: apiData.parentingStatus || "출산예정",
            dueDate: apiData.dueDate ? new Date(apiData.dueDate) : null,
            profileImageUrl: apiData.profileImageUrl || null,
            createdAt: apiData.createdAt || null,
            children: apiData.children
                ? apiData.children.map((child) => ({
                    id: child.id || Date.now(),
                    name: child.name || "",
                    birth: child.birthDate || "",
                    gender: child.gender || "남성",
                }))
                : [],
        };
    }

    formatDateForApi(date) {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
}

export default new ProfileService();