import { Audio } from "expo-av";

const SUPERTONE_API_KEY = process.env.EXPO_PUBLIC_SUPERTONE_API_KEY;
const SUPERTONE_TTS_ENDPOINT = process.env.EXPO_PUBLIC_SUPERTONE_TTS_ENDPOINT;
const SUPERTONE_TOBY_VOICE_ID = process.env.EXPO_PUBLIC_SUPERTONE_TOBY_VOICE_ID;
const SUPERTONE_EMOTION_PARAM_NAME = process.env.EXPO_PUBLIC_SUPERTONE_EMOTION_PARAM_NAME || "style";

export async function fetchTTS(text, emotion) {
    try {
        const payload = {
            voiceId: SUPERTONE_TOBY_VOICE_ID,
            text,
            format: "mp3",
            speed: 1.0,
            pitch: 0,
            [SUPERTONE_EMOTION_PARAM_NAME]: emotion,    //동적으로 감정 파라미터 이름 적용
        };

        const response = await fetch(SUPERTONE_TTS_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${SUPERTONE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errMsg = await response.text();
            throw new Error(`TTS 요청 실패: ${response.status} - ${errMsg}`);
        }

        const data = await response.json();
        return data.audioUrl; // 🎵 슈퍼톤 API 응답의 오디오 URL
    } catch (err) {
        console.error("fetchTTS 오류:", err);
        return null;
    }
}

// 🎧 오디오 재생
export async function playAudio(audioUrl) {
    try {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        await sound.playAsync();
        return sound;
    } catch (err) {
        console.error("오디오 재생 오류:", err);
    }
}