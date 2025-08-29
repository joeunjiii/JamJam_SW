// components/chat/service/chatService.js
import { dmApi } from "./dmApi";

// 목록 API가 아직 없으므로 목업 유지
export async function fetchChats() {
    return [
        {
            id: "1", name: "잼잼잼잼", lastMessage: "육아 나눔 돌봄해요",
            time: "오후 1:20", unreadCount: 0,
            avatar: require("../../../../assets/main/chat/avatar1.png"),
        },
        {
            id: "2", name: "수달이", lastMessage: "아이템 대화내용",
            time: "8월 13일", unreadCount: 0,
            avatar: require("../../../../assets/main/chat/avatar2.png"),
        },
        {
            id: "3", name: "민지맘", lastMessage: "오늘 놀이터에서 만나요!",
            time: "오전 11:30", unreadCount: 2,
            avatar: require("../../../../assets/main/chat/avatar3.png"),
        },
        {
            id: "4", name: "육아모임", lastMessage: "이번 주 모임 장소가 변경되었어요",
            time: "어제", unreadCount: 5,
            avatar: require("../../../../assets/main/chat/avatar1.png"),
        },
    ];
}

export async function fetchMessages(threadId) {
    const list = await dmApi.loadRecent(threadId, 50);
    return list
        .sort((a, b) => a.messageId - b.messageId)
        .map((m) => ({
            id: String(m.messageId),
            sender: String(m.senderId),
            text: m.body || "",
            time: new Date(m.createdAt).toLocaleTimeString(),
            isMe: false,   // ChatRoom에서 myUserId로 보정
            createdAt: m.createdAt,
            senderId: m.senderId,
        }));
}

// 전송은 WebSocket으로 처리 (여기선 사용 안 함)
export async function sendMessage() {
    throw new Error("sendMessage is handled via WebSocket (STOMP).");
}
