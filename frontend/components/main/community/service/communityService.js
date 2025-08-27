// services/communityService.js

// 🔥 로컬 서버 전용 API BASE URL
const API_BASE_URL = "http://43.201.211.116:8082/api";

// -------------------------------
// 📌 게시글 작성
// -------------------------------
export async function createPost(payload) {
    const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // 로그인 붙이면 여기에 추가
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`API 실패: ${res.status}`);
    }

    return await res.json();
}

// -------------------------------
// 📌 파일 업로드 (이미지 등)
// -------------------------------
export async function uploadMedia(fileUri) {
    const formData = new FormData();
    formData.append("file", {
        uri: fileUri,
        name: "upload.jpg",
        type: "image/jpeg",
    });

    const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (!res.ok) {
        throw new Error(`업로드 실패: ${res.status}`);
    }

    const data = await res.json();
    return data.url; // 서버가 반환하는 파일 URL
}

// -------------------------------
// 📌 게시글 목록 조회
// -------------------------------
export async function fetchPosts({ page = 0, size = 10, board = "all" }) {
    const res = await fetch(
        `${API_BASE_URL}/posts?board=${board}&page=${page}&size=${size}`
    );

    if (!res.ok) {
        throw new Error(`조회 실패: ${res.status}`);
    }

    return await res.json(); // Spring Data Page 객체 (content, totalPages 등)
}

// -------------------------------
// 📌 게시글 상세 조회
// -------------------------------
export async function fetchPostDetail(id) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`);

    if (!res.ok) {
        throw new Error(`조회 실패: ${res.status}`);
    }

    return await res.json();
}
