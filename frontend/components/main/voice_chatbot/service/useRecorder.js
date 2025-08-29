import { useState } from "react";
import { Audio } from "expo-av";
import { sendToWhisper } from "./sttService";
import Toast from "react-native-toast-message";


export default function useRecorder(onFinish) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // ⬅️ stop 중복 방지
  const [currentCategory, setCurrentCategory] = useState(null);

  const startRecording = async (category) => {
    try {
      if (isRecording || recording || isProcessing) {
        console.warn("⚠️ 이미 녹음 중이거나 처리 중입니다.");
        return;
      }
  
      // 혹시 모를 이전 세션 초기화
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  
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
      setIsRecording(true);
      setCurrentCategory(category || "일반");
      console.log("🎙️ 녹음 시작 (카테고리:", category, ")");
    } catch (err) {
      console.error("녹음 에러:", err);
    }
  };
  
  

  // 🛑 녹음 종료 + STT 변환
  const stopRecording = async () => {
    try {
      if (!recording || isProcessing) {
        console.warn("⚠️ 현재 녹음 중이 아님 또는 이미 처리 중");
        return;
      }
  
      setIsProcessing(true);
      console.log("🛑 녹음 종료...");
  
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
  
      // 🔥 recorder 객체 확실히 해제
      try {
        recording._cleanupForUnloadedRecorder && recording._cleanupForUnloadedRecorder();
      } catch (e) {
        console.log("Recorder cleanup skipped:", e);
      }
  
      setRecording(null);
      setIsRecording(false);
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  
      console.log("📂 파일 경로:", uri);
  
      const text = await sendToWhisper(uri);
      const result = { uri, text, category: currentCategory };
  
      if (onFinish) onFinish(result);
      return result;
    } catch (err) {
      console.error("녹음 종료 에러:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  // 🔀 버튼에서 쓰기 좋은 토글 함수
  const toggleRecording = async (category) => {
    if (isRecording) {
      if (currentCategory === category) {
        // 같은 버튼 눌렀을 때만 녹음 종료
        return await stopRecording();
      } else {
        // 다른 버튼 → 토스트 안내
        Toast.show({
          type: "info",
          text1: `현재 "${currentCategory}" 진행 중`,
          text2: "먼저 종료해주세요",
          position: "Top",
          visibilityTime: 2000,
          text1Style: { color: "#010000" },   // 🔥 글자색
          text2Style: { color: "#010000" },   // 🔥 보조 글자색
          style: { backgroundColor: "#FF675D" }, // 🔥 배경색
        });
        return;
      }
    } else {
      return await startRecording(category);
    }
  };

  return {
    recording,
    isRecording,
    currentCategory,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
