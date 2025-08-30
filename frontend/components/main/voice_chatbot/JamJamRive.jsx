import Rive from "rive-react-native";
import { View } from "react-native";
import React, { useRef } from "react";
export default function JamJamRive() {
  const riveRef = useRef(null);

  return (
    
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Rive
        resourceName="jamjam"
        artboardName="Android Medium - 1"
        stateMachineName="JamJam"  
        autoplay
        ref={riveRef}
        style={{ width: 250, height: 250 }}
      />
    </View>
  );
}
