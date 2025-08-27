// useRecorder.js
import { useState } from "react";
import { Audio } from "expo-av";
import { sendToWhisper } from "./sttService"; // Whisper API 호출 함수

export default function useRecorder(onFinish) {
  const [recording, setRecording] = useState(null);

  // 🎙️ 녹음 시작
  const startRecording = async () => {
    try {

      if (recording) {
        console.warn("이미 녹음 중입니다.");
        return;
      }


      // 🎯 iOS/Android 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("마이크 권한이 필요합니다!");
        return;
      }


      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log("🎙️ 녹음 시작", recording);
    } catch (err) {
      console.error("녹음 에러:", err);
    }
  };

  // 🛑 녹음 종료 + STT 변환
  const stopRecording = async () => {
    try {
      if (!recording) {
      console.warn("⚠️ 현재 녹음 중이 아님");
      return;
    }

      console.log("🛑 녹음 종료...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);

      console.log("📂 파일 경로:", uri);

      // 🎯 Whisper API 호출 (STT 변환)
      const text = await sendToWhisper(uri);

      // 📌 지금은 "백엔드 전달 X" → 프론트 onFinish로 변환된 텍스트 전달
      if (onFinish) onFinish(text);

      return { uri, text };
    } catch (err) {
      console.error("녹음 종료 에러:", err);
    }
  };

  return { recording, startRecording, stopRecording };
}
