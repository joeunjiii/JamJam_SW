// components/main/jamjam_chat/ws/ChatSocket.js
import { Client } from "@stomp/stompjs";
import { getAccessToken } from "../../../login/service/auth"; // 토큰 가져오기

/**
 * ChatSocket: STOMP WebSocket 클라이언트 (구독 전용)
 * - subscribeThread(threadId): /topic/thread.{id} 구독
 * - 서버는 REST로 저장된 메시지를 브로드캐스트함
 */
export class ChatSocket {
    constructor({ wsUrl, onEvent, onDebug }) {
        this.wsUrl = wsUrl; // 예: ws://<HOST>:8082/ws-native
        this.onEvent = onEvent || (() => {});
        this.onDebug = onDebug || console.log;
        this.client = null;
        this._subscriptions = new Map(); // threadId -> unsubscribe func
    }

    async connect() {
        const token = await getAccessToken();

        this.client = new Client({
            brokerURL: this.wsUrl,
            connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
            debug: (str) => this.onDebug("[STOMP] " + str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            this.onDebug("[STOMP] Connected");
        };

        this.client.onDisconnect = () => {
            this.onDebug("[STOMP] Disconnected");
        };

        this.client.onStompError = (frame) => {
            this.onDebug("[STOMP] Error: " + frame.body);
            this.onEvent({
                type: "ERROR",
                errorCode: frame.headers?.["message"],
                errorMessage: frame.body,
            });
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.onDebug("[STOMP] Disconnecting...");
            try {
                // 모든 구독 해제
                this._subscriptions.forEach((unsub) => {
                    try { unsub(); } catch {}
                });
                this._subscriptions.clear();
            } finally {
                this.client.deactivate();
                this.client = null;
            }
        }
    }

    subscribeThread(threadId) {
        if (!this.client || !this.client.connected) {
            this.onDebug("[STOMP] Not connected, cannot subscribe");
            return;
        }
        const destination = `/topic/thread.${threadId}`;
        this.onDebug("[STOMP] Subscribing to " + destination);

        const sub = this.client.subscribe(destination, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                // 서버 WebSocketMessage 스펙: {type, threadId, messageId, senderId, body, fileUrl, createdAt, ...}
                this.onEvent({ type: payload.type || "CHAT", ...payload });
            } catch (e) {
                this.onDebug("[STOMP] parse error " + e.message);
            }
        });

        // 해제 함수 기록
        this._subscriptions.set(threadId, () => sub.unsubscribe());
    }

    unsubscribeThread(threadId) {
        const unsub = this._subscriptions.get(threadId);
        if (unsub) {
            try { unsub(); } finally {
                this._subscriptions.delete(threadId);
            }
            this.onDebug("[STOMP] Unsubscribed thread " + threadId);
        }
    }
}
