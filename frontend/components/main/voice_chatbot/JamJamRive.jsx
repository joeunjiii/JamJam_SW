import Rive from "rive-react-native";
import { View, Button } from "react-native";
import React, { useRef,useEffect ,useState} from "react";


export default function JamJamRive() {
  const riveRef = useRef(null);



  const [isHappy, setIsHappy] = useState(false);
  const [isAngry, setIsAngry] = useState(false);

 
   // useEffect로 Rive 파일 경로 및 StateMachine 확인
  useEffect(() => {
    if (riveRef.current) {
      // Rive 파일과 StateMachine 이름 확인
      console.log("Rive resourceName:", riveRef.current.resourceName); // resourceName 확인
      console.log("Rive artboardName:", riveRef.current.artboardName); // artboardName 확인
      console.log("Rive stateMachineName:", riveRef.current.stateMachineName); // stateMachineName 확인
    }
  }, []); // 초기 렌더링 후 한 번만 실행
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      <Rive
        resourceName="jamjam"
        artboardName="Android Medium - 1"
        stateMachineName="JamJam"
        autoplay
        ref={riveRef}
        style={{ width: 380, height: 400, top: -124 }}
      />

    </View>
  );
}
