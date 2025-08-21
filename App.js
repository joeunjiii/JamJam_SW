import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'react-native-gesture-handler';
import Login from "./components/login/Login";
import Main from "./components/main/Main";
import ProfileScreen from "./components/login/ProfileScreen";
import MyPage from "./components/main/mypage/MyPage";
import ProfileEditScreen from "./components/main/mypage/ProfileEditScreen";
import PolicyCurationOnboarding from "./components/main/policycuration/PolicyCurationOnboarding";
import PolicyCurationQuestionScreen from "./components/main/policycuration/PolicyCurationQuestionScreen";
import JamJamTestIntro from "./components/main/jamjam_test/JamJamTestIntro";
import JamJamTestScreen from "./components/main/jamjam_test/JamJamTestScreen";
import CommunityHomeScreen from "./components/main/community/CommunityHomeScreen";
import PostCreateScreen from "./components/main/community/PostCreateScreen";
import PostDetailScreen from "./components/main/community/PostDetailScreen";
import JamjamChat from "./components/main/jamjam_chat/Jamjam_chat";

import MapContainerScreen from "./components/main/find_center/MapContainerScreen";
import VoiceCallScreen from "./components/main/voice_chatbot/VoiceCallScreen";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
        <Stack.Screen name="PolicyCurationOnboarding" component={PolicyCurationOnboarding} />
        <Stack.Screen name="PolicyCurationQuestionScreen" component={PolicyCurationQuestionScreen} />
        <Stack.Screen name="JamJamTestIntro" component={JamJamTestIntro} />
        <Stack.Screen name="JamJamTestScreen" component={JamJamTestScreen} />
        <Stack.Screen name="CommunityHomeScreen" component={CommunityHomeScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="PostCreate" component={PostCreateScreen} />
        <Stack.Screen
          name="Chat"
          component={JamjamChat}
          options={{
            headerShown: false,
            title: "잼잼톡"
          }}
        />
        <Stack.Screen name="Center" component={MapContainerScreen} />
        <Stack.Screen name="VoiceCallScreen" component={VoiceCallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
