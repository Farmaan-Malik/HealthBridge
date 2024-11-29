import {Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Themes from "@/assets/colors/colors";
import { useExpoRouter } from "expo-router/build/global-state/router-store";

const MainLayout = () => {
    const router =useExpoRouter()
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={()=>{router.goBack()}}
              >
                <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                  Logout
                </Text>
                <Ionicons
                  name="log-out-outline"
                  size={25}
                  color={Themes.doctorTheme.primaryColor}
                />
              </TouchableOpacity>
            );
          },
          headerShown:false
        }}
      />
      <Stack.Screen
        name="patientScreen"
        options={{
          title: "",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={()=>{router.goBack()}}

              >
                <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                  Logout
                </Text>
                <Ionicons
                  name="log-out-outline"
                  size={25}
                  color={Themes.doctorTheme.primaryColor}
                />
              </TouchableOpacity>
            );
          },headerShown:false
        }}
      />
    </Stack>
  );
};

export default MainLayout;
