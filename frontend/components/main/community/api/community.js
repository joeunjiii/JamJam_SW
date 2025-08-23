// 실제 서버 붙일 때 axios로 바꾸면 됨
const MOCK = Array.from({ length: 60 }).map((_, i) => ({
    id: `p${i + 1}`,
    category: i % 10 === 0 ? "notice" : i % 3 === 0 ? "qa" : "free",
    title:
      i % 5 === 0
        ? "아 진짜 어떻게 하면 예쁘게 하나 스트레스 받아요^^!!"
        : i % 4 === 0
        ? "밤에 아기가 자주 깨는데 어떻게 해야 하나요?"
        : "아이가 떼쓸 때 감정적으로 대응하게 돼요. 어떻게 해야 할까요?",
    author: i % 2 === 0 ? "사용자2" : "젊맘부부",
    createdAt: "12:12",
    commentCount: (i * 7) % 5,
    thumbnail: i % 5 === 0 ? "video" : null, // 썸네일/비디오 자리 표시
    hot: i % 11 === 0, // '지금 급나 많이 보고 있어요!' 배지
  }));
  
  export async function fetchPosts({ page = 1, pageSize = 10, category = "all" }) {
    await new Promise((r) => setTimeout(r, 350)); // 로딩 느낌
    const filtered =
      category === "all" ? MOCK : MOCK.filter((p) => p.category === category);
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    const hasNext = start + pageSize < filtered.length;
    return { items: slice, nextPage: hasNext ? page + 1 : null };
  }
  
  export async function fetchPostDetail(id) {
    await new Promise((r) => setTimeout(r, 200));
    const post = MOCK.find((p) => p.id === id);
    return {
      ...post,
      content:
        "내용 예시입니다. 아이와 부모의 공통 성장 밸런스가 중요해요~ 댓글로 경험을 나눠주세요!",
    };
  }
  
  export async function createPost({ title, content, category }) {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true, id: `p${Date.now()}` };
  }
  