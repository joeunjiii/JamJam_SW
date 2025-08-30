import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Rive from 'rive-react-native';

const RiveComponent = ({ riveRef }) => {
  return (
    <View style={styles.container}>
      <Rive
        resourceName="jamjam"              // Rive 파일 이름 (확장자 제외)
        artboardName="Android Medium - 1"   // Rive 에디터에서 설정한 아트보드 이름
        stateMachineName="JamJam"           // Rive 파일에서 설정한 상태 머신 이름
        autoplay={true}                     // 애니메이션 자동 시작
        ref={riveRef}                       // Rive 인스턴스를 참조하기 위한 ref
        style={styles.riveStyle}            // 스타일 적용
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  riveStyle: {
    width: 380,   // 애니메이션의 너비
    height: 500,  // 애니메이션의 높이
  },
});

export default RiveComponent;
