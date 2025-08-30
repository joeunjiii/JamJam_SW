import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Rive from 'rive-react-native';

const JamJamRive = ({ riveRef }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading,setloading] = useState(false);
  const onRiveLoad = () => {
    setIsLoaded(true); // 애니메이션이 로드되었을 때 상태를 업데이트
  };
  // 애니메이션 상태를 변경하는 함수
  function ChangeAnimation(loading) {
    if (riveRef.current) {
      // 'JamJam' 상태 머신의 'Istalking' 입력값을 설정
      riveRef.current.setInputState("JamJam", "Istalking", loading);
    } else {
      console.warn("Rive 애니메이션이 로드되지 않았습니다.");
    }
  }

  return (
    <View style={styles.container}>
      <Rive
        resourceName="jamjam"              // Rive 파일 이름 (확장자 제외)
        artboardName="Android Medium - 1"   // Rive 에디터에서 설정한 아트보드 이름
        stateMachineName="JamJam"           // 상태 머신 이름
        autoplay={true}                     // 애니메이션 자동 시작
        ref={riveRef}
        onLoad={onRiveLoad}
        fit="contain"                       // 애니메이션을 화면에 맞게 조정 (비율 유지)
        style={styles.riveStyle}            // 스타일 적용
      />
      <Button title="Start Talking" onPress={() => ChangeAnimation(true)} />
      <Button title="Stop Talking" onPress={() => ChangeAnimation(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riveStyle: {
    width: 380,    // Rive 애니메이션의 너비
    height: 500,   // Rive 애니메이션의 높이
  },
});

export default JamJamRive;
