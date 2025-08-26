// services/chatService.js
export async function fetchChats() {
    // 나중에 백엔드 API 호출로 교체
    // const res = await fetch(`${API_BASE}/chats`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   return await res.json();  // 이용자별 목록 내려옴
    return [
        {
            id: '1',
            name: '잼잼잼잼',
            lastMessage: '육아 나눔 돌봄해요',
            time: '오후 1:20',
            unreadCount: 0,
            avatar: require("../../../../assets/main/chat/avatar1.png"),
        },
        {
            id: '2',
            name: '수달이',
            lastMessage: '아이템 대화내용',
            time: '8월 13일',
            unreadCount: 0,
            avatar: require("../../../../assets/main/chat/avatar2.png"),
        },
        {
            id: '3',
            name: '민지맘',
            lastMessage: '오늘 놀이터에서 만나요!',
            time: '오전 11:30',
            unreadCount: 2,
            avatar: require("../../../../assets/main/chat/avatar3.png"),
        },
        {
            id: '4',
            name: '육아모임',
            lastMessage: '이번 주 모임 장소가 변경되었어요',
            time: '어제',
            unreadCount: 5,
            avatar: require("../../../../assets/main/chat/avatar1.png"),
        },
    ];
}
export async function fetchMessages(chatId, token) {
    return [
      { id: "1", sender: "상대방", text: "안녕하세요!", time: "오후 4:32", isMe: false },
      { id: "2", sender: "나", text: "네 반가워요!", time: "오후 8:02", isMe: true },
    ];
  }
// 메시지 보내기
export async function sendMessage(chatId, text, token) {
    // 나중엔 POST 호출
    // await fetch(`${API_BASE}/chats/${chatId}/messages`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text }),
    // });
  
    // 목업 응답
    return {
      id: Date.now().toString(),
      sender: "나",
      text,
      time: "오후 9:15",
      isMe: true,
    };
  }

  
