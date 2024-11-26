import { View, Text, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Themes from "@/assets/colors/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const DoctorCard = ({ height, width, image,onPress,name }) => {
  return (
    <View
      style={{
        width: width ?? "80%",
        height: height ?? "60%",
        borderRadius: 30,
        shadowOpacity: 0.2,
        shadowOffset: { width: 10, height: 20 },
        shadowColor: "black",
        elevation:10,
        marginTop:30,
      }}
    >
      <LinearGradient
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
        }}
        colors={[
          Themes.patientTheme.primaryColor,
          Themes.patientTheme.secondaryColor,
        ]}
        start={[0.1, 0.1]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LinearGradient
            style={{
              width: 150,
              height: 150,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
            }}
            colors={[
              Themes.doctorTheme.primaryColor,
              Themes.doctorTheme.secondaryColor,
            ]}
            start={[0.2, 0.1]}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                display: "flex",
                borderWidth: 0.2,
                borderRadius: 30,
                backgroundColor: "transparent",
              }}
              source={image}
            />
          </LinearGradient>
          <Text style={{ fontSize: 25, fontWeight: "600", marginTop: 20 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "300" }}>
            Cardiology Specialist
          </Text>
          <Ionicons
            style={{
              padding: 8,
              borderRadius: 50,
              backgroundColor: "white",
              shadowOpacity: 0.2,
              shadowOffset: { width: 2, height: 8 },
              shadowColor: "black",
              elevation:10,
              marginVertical:10
            }}
            onPress={onPress}
            size={40}
            color={Themes.patientTheme.secondaryColor}
            name="videocam"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default DoctorCard;
