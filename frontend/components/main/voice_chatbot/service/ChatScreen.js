import { sendTextToBackend } from "./sttService";
import { fetchTTS, playAudio } from "./ttsService";

async function handleChat(userText) {
    try {


        const { answer, emotion } = await sendTextToBackend(userText);
        console.log("챗봇 응답:", answer, emotion);


        // 2. 슈퍼톤 TTS 호출
        const audioUrl = await fetchTTS(answer, emotion);

        // 3. 오디오 재생
        if (audioUrl) {
            await playAudio(audioUrl);
        }
        // 4. Rive 감정 애니메이션 실행
        // if (riveAnimation) {
        //     riveAnimation.play(emotion);
        // }
    } catch (err) {
        console.error("챗봇 연결 오류:", err);
    }
}