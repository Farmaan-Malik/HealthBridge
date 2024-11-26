import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Themes from "../assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({ doctor, width, height,style,text,onPress }) => {
  return (
    <View
    style={{
      width: width ?? "50%",
      height: height ?? 50,
      borderRadius: 30,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <TouchableOpacity
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        overflow:'hidden',
        ...style,
      }}
      onPress={onPress}
    >
      <LinearGradient
        start={[0.5, 0.1]}
        colors={
          doctor
            ? ([
                Themes.doctorTheme.primaryColor,
                Themes.doctorTheme.secondaryColor,
              ])
            : (
              [
                Themes.patientTheme.primaryColor,
                Themes.patientTheme.secondaryColor,
              ])
        }
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
         {text}
        </Text>
      </LinearGradient>
      </TouchableOpacity>
      </View>
  );
};

export default CustomButton;
