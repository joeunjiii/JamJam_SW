// services/communityService.js

// ✅ 목업 데이터
const MOCK_POSTS = [
    {
        id: 1,
        title: "앱 사용 가이드",
        content: "잼잼 커뮤니티를 안전하게 사용하는 방법을 안내합니다.",
        isPinned: true,
        author: "관리자",
        createdAt: "1일 전",
        commentCount: 12,
        category: "notice",
    },
    {
        id: 2,
        title: "커뮤니티 이용규칙",
        content: "서로를 존중하며 소통하는 공간을 만들어가요.",
        isPinned: true,
        author: "운영팀",
        createdAt: "3일 전",
        commentCount: 7,
        category: "notice",
    },
    {
        id: 3,
        title: "첫 임신, 궁금한 게 너무 많아요",
        content: "12주차인데 갑자기 입덧이 심해졌어요. 비슷한 경험 있으신가요?",
        isPinned: false,
        author: "초보엄마",
        createdAt: "2시간 전",
        commentCount: 5,
        category: "qa",
    },
    {
        id: 4,
        title: "아기 수면 교육 어떻게 시작했나요?",
        content: "밤낮 구분이 안돼서 매일 힘들어요 ㅠㅠ 팁 공유해주세요!",
        isPinned: false,
        author: "수면교육중",
        createdAt: "5시간 전",
        commentCount: 3,
        category: "free",
    },
    {
        id: 5,
        title: "남편이 육아에 관심이 없어요",
        content: "대화도 해봤는데 여전히 무관심한 것 같아요... 어떻게 해야 할까요?",
        isPinned: false,
        author: "맘스터치",
        createdAt: "어제",
        commentCount: 8,
        category: "free",
    },
];

// ✅ 일반 게시글
export async function fetchPosts({ page = 1, pageSize = 10, category = "all" }) {
    try {
        // 👉 나중에 실제 API 호출 (주석 처리)
        /*
        const res = await fetch(
          `https://api.jamjam.kr/community/posts?page=${page}&size=${pageSize}&category=${category}`
        );
        const data = await res.json();
        return {
          items: data.items || [],
          nextPage: data.nextPage || null,
        };
        */

        // 👉 지금은 목업 반환
        let items = MOCK_POSTS;
        if (category !== "all") {
            items = items.filter((p) => p.category === category);
        }
        const start = (page - 1) * pageSize;
        const paged = items.slice(start, start + pageSize);
        const nextPage = start + pageSize < items.length ? page + 1 : null;

        return {
            items: paged,
            nextPage,
        };
    } catch (e) {
        console.error("❌ fetchPosts error:", e);
        return { items: [], nextPage: null };
    }
}
// services/communityService.js

export async function fetchPostDetail(id) {
    try {
        // 📌 실제 API (나중에 연결)
        /*
        const res = await fetch(`https://api.jamjam.kr/community/posts/${id}`);
        return await res.json();
        */

        //  목업 데이터
        return {
            id,
            title: "앱 사용 가이드",
            content: "잼잼 커뮤니티를 안전하게 사용하는 방법을 안내합니다.",
            author: "관리자",
            createdAt: "1일 전",
            commentCount: 12,
        };
    } catch (e) {
        console.error("❌ fetchPostDetail error:", e);
        return null;
    }
}

// 필독글
export async function fetchPinnedPosts() {
    try {
        // 👉 나중에 실제 API 호출 (주석 처리)
        /*
        const res = await fetch(`https://api.jamjam.kr/community/posts/pinned`);
        return await res.json();
        */

        // 👉 지금은 목업 반환
        return MOCK_POSTS.filter((p) => p.isPinned);
    } catch (e) {
        console.error("❌ fetchPinnedPosts error:", e);
        return [];
    }
}
