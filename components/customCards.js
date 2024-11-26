import { View, Text, Image } from "react-native";
import React from "react";
import Themes from "@/assets/colors/colors";

const CustomCards = ({ image }) => {
  return (
    <View
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 30,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: "white",
        elevation:10
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "600" }}>Dr. Peralta</Text>
        <Text style={{ fontSize: 18, fontWeight: "300" }}>
          Cardiology Specialist
        </Text>
      </View>
      <Image
        style={{
          width: 80,
          height: 80,
          display: "flex",
          borderWidth: 0.2,
          borderRadius: 30,
          backgroundColor: Themes.doctorTheme.secondaryColor,
        }}
        source={image}
      />
    </View>
  );
};

export default CustomCards;
