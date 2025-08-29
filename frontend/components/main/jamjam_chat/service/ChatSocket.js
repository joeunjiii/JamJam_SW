// components/chat/ws/ChatSocket.js
import { Client } from "@stomp/stompjs";
import { getAccessToken, tryRefreshToken } from "../service/auth";

/**
 * RN/Expo에서는 SockJS 대신 네이티브 WebSocket 사용 권장.
 * 서버 WebSocketConfig에 반드시 "/ws-native" 엔드포인트가 추가되어야 함.
 */
export class ChatSocket {
    constructor({
                    wsUrl = "ws://localhost:8082/ws-native",
                    onEvent,   // (ev) => void
                    onDebug,   // (msg) => void
                }) {
        this.wsUrl = wsUrl;
        this.onEvent = onEvent || (() => {});
        this.log = (...a) => (onDebug ? onDebug(a.join(" ")) : console.log(...a));
        this.reconnectAttempt = 0;
        this.maxReconnectMs = 20000;
        this.baseReconnectMs = 1000;
        this.subscriptions = {};

        this.client = new Client({
            webSocketFactory: () => {
                const ws = new WebSocket(this.wsUrl);
                // 원시 WS 이벤트 (요구사항: onopen/onmessage/onerror/onclose)
                ws.onopen = () => this.log("[WS] onopen");
                ws.onmessage = (e) => this.log("[WS] onmessage raw:", (e?.data || "").toString().slice(0, 200));
                ws.onerror = (e) => this.log("[WS] onerror:", JSON.stringify(e));
                ws.onclose = (e) => {
                    this.log(`[WS] onclose code=${e.code} reason=${e.reason || ""}`);
                    // 1006/1001/1000 → 재연결
                    if ([1006, 1001, 1000].includes(e.code)) this.scheduleReconnect(e.code);
                    // 1008(policy violation) → 토큰 문제 가능
                    if (e.code === 1008) this.scheduleReconnect(e.code);
                };
                return ws;
            },
            // connectHeaders는 connect() 시점에 동적으로 세팅(토큰 읽기)
            connectHeaders: {},
            reconnectDelay: 0,
            heartbeatIncoming: 15000,
            heartbeatOutgoing: 15000,
            debug: (s) => this.log("[STOMP]", s),
            onConnect: () => {
                this.reconnectAttempt = 0;
                this.log("[STOMP] onConnect");
            },
            onStompError: (frame) => {
                const msg = frame.headers?.message || "stomp-error";
                this.log("[STOMP] onStompError:", msg, frame.body);
                this.onEvent({ type: "ERROR", errorCode: "BROKER_ERROR", errorMessage: msg, createdAt: new Date().toISOString() });
                // 인증 실패 단서가 있으면 재연결 전 refresh 시도
                if (/unauth|forbid|denied|401|403/i.test(msg)) this.refreshAndReconnect();
            },
            onWebSocketError: (ev) => this.log("[STOMP] onWebSocketError:", JSON.stringify(ev)),
            onWebSocketClose: (e) => {
                this.log(`[STOMP] onWebSocketClose code=${e.code} reason=${e.reason || ""}`);
                if ([1006, 1001, 1000, 1008].includes(e.code)) this.scheduleReconnect(e.code);
            },
            logRawCommunication: false,
        });
    }

    async setAuthHeader() {
        const token = await getAccessToken();
        this.client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    }

    scheduleReconnect(code) {
        this.reconnectAttempt += 1;
        const expo = Math.min(this.maxReconnectMs, this.baseReconnectMs * 2 ** (this.reconnectAttempt - 1));
        const jitter = Math.floor(Math.random() * 500);
        const delay = expo + jitter;
        this.log(`[WS] scheduleReconnect attempt=${this.reconnectAttempt} in ${delay}ms (code=${code})`);
        clearTimeout(this._reconTimer);
        this._reconTimer = setTimeout(() => this.connect(), delay);
    }

    async refreshAndReconnect() {
        const newToken = await tryRefreshToken();
        if (newToken) {
            this.log("[AUTH] refreshed token, reconnect now");
            await this.connect(true);
        } else {
            this.log("[AUTH] refresh failed/no refresh token");
        }
    }

    async connect(immediate = false) {
        if (this.client.active) {
            this.log("[WS] already active");
            return;
        }
        await this.setAuthHeader();
        if (immediate) this.reconnectAttempt = 0;
        this.log("[WS] connecting...");
        this.client.activate();
    }

    disconnect() {
        try {
            Object.values(this.subscriptions).forEach((s) => s?.unsubscribe?.());
            this.subscriptions = {};
        } finally {
            this.client.deactivate();
            clearTimeout(this._reconTimer);
        }
    }

    subscribeThread(threadId) {
        const dest = `/topic/thread.${threadId}`;
        if (this.subscriptions[dest]) return;

        this.subscriptions[dest] = this.client.subscribe(dest, (msg) => {
            try {
                const data = JSON.parse(msg.body);
                this.onEvent(data);
            } catch (e) {
                this.log("[WS] decode error:", e?.message);
                this.onEvent({ type: "ERROR", errorCode: "DECODE_ERROR", errorMessage: e?.message, createdAt: new Date().toISOString() });
            }
        });

        if (!this.subscriptions["/user/queue/ack"]) {
            this.subscriptions["/user/queue/ack"] = this.client.subscribe("/user/queue/ack", (m) => {
                try { this.onEvent(JSON.parse(m.body)); } catch (e) { this.log("[WS] ack decode error:", e?.message); }
            });
        }
        if (!this.subscriptions["/user/queue/errors"]) {
            this.subscriptions["/user/queue/errors"] = this.client.subscribe("/user/queue/errors", (m) => {
                try { this.onEvent(JSON.parse(m.body)); } catch (e) { this.log("[WS] err decode error:", e?.message); }
            });
        }
    }

    sendMessage(threadId, { body, fileUrl, clientMsgId }) {
        const payload = {
            threadId,
            body,
            fileUrl,
            clientMsgId,
            sentAt: new Date().toISOString(),
        };
        this.client.publish({
            destination: `/app/chat.send.${threadId}`,
            body: JSON.stringify(payload),
            skipContentLengthHeader: true,
        });
    }
}
