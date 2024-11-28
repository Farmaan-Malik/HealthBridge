import { View, Text } from "react-native";
import React from "react";
import Themes from "@/assets/colors/colors";

const CustomMessageBox = ({ role,Message }) => {
  return (
    <View
      style={{
        display: "flex",
        width: "100%",
        minHeight: 90,
        borderRadius: 20,
        overflow: "hidden",
        alignItems: Message.role == role ? "flex-end" : "flex-start",
        marginBottom:8
      }}
    >
      <View
        style={{
          width: "60%",
          minHeight: 70,
          justifyContent: "center",
          borderRadius: 20,
          backgroundColor: (Message.role === "patient") ? Themes.patientTheme.primaryColor : Themes.doctorTheme.primaryColor,
          shadowColor: "black",
          shadowOffset: { width: -6, height: 7 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          marginBottom: 12,
          padding: 10,
        }}
      >
        <Text style={{color:'white',fontWeight:'700'}}>{Message.message}</Text>
      </View>
    </View>
  );
};

export default CustomMessageBox;
