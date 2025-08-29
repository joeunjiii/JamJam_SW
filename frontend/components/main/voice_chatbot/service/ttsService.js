import { Audio } from "expo-av";

const SUPERTONE_API_KEY = process.env.EXPO_PUBLIC_SUPERTONE_API_KEY;
const SUPERTONE_TTS_ENDPOINT = process.env.EXPO_PUBLIC_SUPERTONE_TTS_ENDPOINT;
const SUPERTONE_TOBY_VOICE_ID = process.env.EXPO_PUBLIC_SUPERTONE_TOBY_VOICE_ID;
const SUPERTONE_EMOTION_PARAM_NAME = process.env.EXPO_PUBLIC_SUPERTONE_EMOTION_PARAM_NAME || "style";

export async function fetchTTS(aiResponse) {
    console.log("🎤 fetchTTS 호출됨:", aiResponse);
    console.log("🔑 SUPERTONE_API_KEY:", SUPERTONE_API_KEY);
    console.log("🌍 SUPERTONE_TTS_ENDPOINT:", SUPERTONE_TTS_ENDPOINT);
    try {
        const url = `${SUPERTONE_TTS_ENDPOINT}/v1/text-to-speech/${SUPERTONE_TOBY_VOICE_ID}/stream?output_format=wav`;

        const emotionMap = {
            "기쁨": "happy",
            "슬픔": "sad",
            "분노": "angry",
            "당황": "embarrassed",
            "불안": "anxious",
            "중립": "neutral",
        };

        const style = emotionMap[aiResponse.user_emotion] || "neutral";

        const payload = {
            text: aiResponse.output,
            language: "ko",
            style,
            model: "sona_speech_1",
            voice_settings: {
                pitch_shift: 0,
                pitch_variance: 1,
                speed: 1,
            },
        };

        console.log("🎤 TTS 요청 payload:", payload);

        const response = await fetch(
            `${SUPERTONE_TTS_ENDPOINT}/v1/text-to-speech/${SUPERTONE_TOBY_VOICE_ID}/stream`,
            {
                method: "POST",
                headers: {
                    "x-sup-api-key": SUPERTONE_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const errMsg = await response.text();
            throw new Error(`TTS 요청 실패: ${response.status} - ${errMsg}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(blob);

        return audioUrl;
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

        // 재생 끝나면 자동 해제 (리소스 관리)
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (err) {
        console.error("재생 오류:", err);
    }
}