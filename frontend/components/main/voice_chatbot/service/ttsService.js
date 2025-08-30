import { Audio } from "expo-av";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

const SUPERTONE_API_KEY = process.env.EXPO_PUBLIC_SUPERTONE_API_KEY;
const SUPERTONE_TTS_ENDPOINT = process.env.EXPO_PUBLIC_SUPERTONE_TTS_ENDPOINT;
const SUPERTONE_TOBY_VOICE_ID = process.env.EXPO_PUBLIC_SUPERTONE_TOBY_VOICE_ID;
const SUPERTONE_EMOTION_PARAM_NAME = process.env.EXPO_PUBLIC_SUPERTONE_EMOTION_PARAM_NAME || "style";

// 감정 매핑 함수
function mapEmotionToEnglish(koreanEmotion) {
    const emotionMap = {
        '기쁨': 'happy',
        '행복': 'happy',
        '즐거움': 'happy',
        '슬픔': 'sad',
        '우울': 'sad',
        '슬픈': 'sad',
        '화남': 'angry',
        '분노': 'angry',
        '화가': 'angry',
        '짜증': 'angry',
        '부끄러움': 'embarrassed',
        '창피': 'embarrassed',
        '당황': 'embarrassed',
        '불안': 'anxious',
        '걱정': 'anxious',
        '긴장': 'anxious',
        '중립': 'neutral',
        '평온': 'neutral',
        '무감정': 'neutral'
    };
    
    return emotionMap[koreanEmotion] || 'neutral';
}

export async function fetchTTS(aiResponse) {
    console.log("🎤 fetchTTS 호출됨:", aiResponse);
    console.log("🔑 SUPERTONE_API_KEY:", SUPERTONE_API_KEY);
    console.log("🌍 SUPERTONE_TTS_ENDPOINT:", SUPERTONE_TTS_ENDPOINT);
    try {
        const url = `${SUPERTONE_TTS_ENDPOINT}/v1/text-to-speech/${SUPERTONE_TOBY_VOICE_ID}/stream`;

        const style = mapEmotionToEnglish(aiResponse.user_emotion);
        console.log("🎭 매핑된 감정:", aiResponse.user_emotion, "→", style);
        
        const payload = {
            text: aiResponse.output,
            language: "ko",
            style: style,
            model: "sona_speech_1",
            voice_settings: {
                pitch_shift: 0,
                pitch_variance: 1,
                speed: 1,
            },
        };

        console.log("🎤 TTS 요청 payload:", payload);
        console.log("🎤 Voice ID:", SUPERTONE_TOBY_VOICE_ID);

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
        { uri },  // 이제 file://... 형태라 재생 가능
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