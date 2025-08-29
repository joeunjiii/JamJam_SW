import { useState } from "react";
import { Audio } from "expo-av";
import { sendToWhisper } from "./sttService";
import Toast from "react-native-toast-message";

let recordingInstance = null; // 🔑 전역 하나만

const useRecorder = (onFinish) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🎙️ 녹음 시작
  const startRecording = async () => {
    try {
      if (isRecording || isProcessing) {
        console.warn("⚠️ 이미 녹음 중이거나 처리 중입니다.");
        return;
      }

      if (recordingInstance) {
        console.warn("⚠️ 기존 녹음 인스턴스가 있습니다. 정리 후 재시도합니다.");
        recordingInstance = null;
      }

      setIsProcessing(true);

      // 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "마이크 권한 필요",
          text2: "설정에서 마이크 권한을 허용해주세요",
          position: "top",
          visibilityTime: 3000,
        });
        setIsProcessing(false);
        return;
      }

      // 오디오 모드 설정
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch (e) {
        console.log("Audio mode setting failed:", e);
      }

      // 녹음 시작
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingInstance = recording;
      setIsRecording(true);
      console.log("🎙️ 녹음 시작 성공");
      
    } catch (err) {
      console.error("녹음 시작 에러:", err);
      // 에러 발생 시 상태 정리
      recordingInstance = null;
      setIsRecording(false);
      
      Toast.show({
        type: "error",
        text1: "녹음 시작 실패",
        text2: "다시 시도해주세요",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 🛑 녹음 종료
  const stopRecording = async () => {
    try {
      if (!recordingInstance) {
        console.warn("⚠️ 녹음 중이 아닙니다.");
        return;
      }

      if (isProcessing) {
        console.warn("⚠️ 이미 처리 중입니다.");
        return;
      }

      setIsProcessing(true);
      console.log("🛑 녹음 종료...");

      // 녹음 중지 및 언로드
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();

      // 녹음 인스턴스 정리
      try {
        if (recordingInstance._cleanupForUnloadedRecorder) {
          recordingInstance._cleanupForUnloadedRecorder();
        }
      } catch (e) {
        console.log("Recorder cleanup skipped:", e);
      }

      // 상태 초기화
      recordingInstance = null;
      setIsRecording(false);

      // 오디오 모드 복원
      try {
        await Audio.setAudioModeAsync({ 
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false 
        });
      } catch (e) {
        console.log("Audio mode reset failed:", e);
      }

      console.log("📂 파일 경로:", uri);

      // Whisper로 텍스트 변환 (에러 처리 강화)
      try {
        const text = await sendToWhisper(uri);
        if (onFinish) onFinish({ uri, text });
      } catch (whisperError) {
        console.error("Whisper 변환 실패:", whisperError);
        // Whisper 실패해도 녹음은 성공적으로 종료
        if (onFinish) onFinish({ uri, text: null, error: whisperError.message });
      }

    } catch (err) {
      console.error("녹음 종료 에러:", err);
      // 에러 발생 시에도 상태 정리
      recordingInstance = null;
      setIsRecording(false);
      setIsProcessing(false);
      
      // 사용자에게 에러 알림
      Toast.show({
        type: "error",
        text1: "녹음 종료 실패",
        text2: "다시 시도해주세요",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔀 토글
  const toggleRecording = async () => {
    if (isProcessing) {
      Toast.show({
        type: "info",
        text1: "⏳ 처리 중입니다",
        text2: "잠시만 기다려주세요",
        position: "top",
        visibilityTime: 1500,
        style: { backgroundColor: "#FF675D" },
      });
      return;
    }

    if (isRecording) {
      return await stopRecording();
    } else {
      return await startRecording();
    }
  };

  return { isRecording, startRecording, stopRecording, toggleRecording };
};

export default useRecorder;
