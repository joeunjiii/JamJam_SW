// services/voiceService.js
let timerId = null;

export async function fetchCaption(phase) {
  // 실제로는 Whisper/AI API 호출해서 텍스트 받아옴
  return phase === "speaking" ? "AI가 대답 중이에요..." : "듣고 있어요!";
}

export function startTimer(callback) {
  let seconds = 0;
  timerId = setInterval(() => {
    seconds++;
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    callback(`${mm}:${ss}`);
  }, 1000);
}

export function stopTimer() {
  if (timerId) clearInterval(timerId);
}
