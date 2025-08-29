// sttService.js
import { Audio } from "expo-av";



export async function sendToWhisper(uri) {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.m4a",
      type: "audio/m4a",
    });
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Whisper API 에러:", data.error?.message || data);
      return null;
    }

    return data.text; // 변환된 텍스트 반환
  } catch (err) {
    console.error("Whisper API 호출 에러:", err);
    return null;
  }
}


//AI 서버 호출 준비,sentTextToBackend함수를 통해서 백엔드로 보냄
export async function sendTextToBackend(userText) {
  const url = `${process.env.EXPO_PUBLIC_API_URL2}/chat`;
  
  console.log("🌍 백엔드 요청 URL:", url);
  console.log("📦 요청 body:", {
    member_id: 7,
    input: userText,
  });

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL2}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_id: 7,        // ✅ 고정 ID (나중에 로그인 연동 가능)
        input: userText,     // ✅ 사용자 입력
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`백엔드 오류 ${response.status}: ${errText}`);
    }

    // FastAPI 응답: { answer, emotion }
    return await response.json();
  } catch (err) {
    console.error("백엔드 전송 에러:", err);
    return null;
  }
}