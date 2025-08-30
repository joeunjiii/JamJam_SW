import Rive from "rive-react-native";
import { View, Button } from "react-native";
import React, { useRef,useEffect } from "react";


export default function JamJamRive() {
  const riveRef = useRef(null);


  useEffect(() => {
    setTimeout(() => {
      console.log("🎯 트리거 실행");
      riveRef.current?.trigger("Happy");   // Trigger input 실행
      // riveRef.current?.setBoolean("isHappy", true); // Boolean input
      // riveRef.current?.setNumber("moodLevel", 5);   // Number input
    }, 1000);
  }, []);

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
