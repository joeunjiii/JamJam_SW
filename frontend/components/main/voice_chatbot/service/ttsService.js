import { Audio } from "expo-av";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

const SUPERTONE_API_KEY = process.env.EXPO_PUBLIC_SUPERTONE_API_KEY;
const SUPERTONE_TTS_ENDPOINT = process.env.EXPO_PUBLIC_SUPERTONE_TTS_ENDPOINT;
const SUPERTONE_TOBY_VOICE_ID = process.env.EXPO_PUBLIC_SUPERTONE_TOBY_VOICE_ID;
const SUPERTONE_EMOTION_PARAM_NAME = process.env.EXPO_PUBLIC_SUPERTONE_EMOTION_PARAM_NAME || "style";

export async function fetchTTS(aiResponse) {
    console.log("🎤 fetchTTS 호출됨:", aiResponse);
    console.log("🔑 SUPERTONE_API_KEY:", SUPERTONE_API_KEY);
    console.log("🌍 SUPERTONE_TTS_ENDPOINT:", SUPERTONE_TTS_ENDPOINT);
    try {
        const url = `${SUPERTONE_TTS_ENDPOINT}/v1/text-to-speech/${SUPERTONE_TOBY_VOICE_ID}/stream`;

        const { answer, emotion } = aiResponse;

        const emotionMap = {
            "기쁨": "happy",
            "슬픔": "sad",
            "분노": "angry",
            "당황": "embarrassed",
            "불안": "anxious",
            "중립": "neutral",
        };

        const style = emotionMap[emotion] || "neutral";

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
            [SUPERTONE_EMOTION_PARAM_NAME]: style,
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

        // 🔹 base64 로 받기
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // 🔹 파일로 저장
        const fileUri = FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`;
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        console.log("✅ TTS 변환 성공! 파일 경로:", fileUri);
        console.log("✅ TTS 변환 성공! base64 길이:", base64.length);
        return fileUri;
    } catch (err) {
      console.error("fetchTTS 오류:", err);
      return null;
    }  
}

// 🎧 오디오 재생
export async function playAudio(uri) {
    try {
      console.log("🎧 재생할 파일:", uri);
      const { sound } = await Audio.Sound.createAsync(
        { uri },  // ✅ 이제 file://... 형태라 재생 가능
        { shouldPlay: true }
      );
  
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("🔊 재생 완료");
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.error("재생 오류:", err);
    }
  }