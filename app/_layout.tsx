import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return(
  <Stack screenOptions={{headerShown:false, gestureEnabled:false}}>
    <Stack.Screen
    name="index"
    />
    <Stack.Screen
    name="(main)/"/>
    <Stack.Screen
    name="(main)/patientScreen"/>
  </Stack>
  )
}
