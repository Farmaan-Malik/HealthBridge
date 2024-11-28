import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Themes from "@/assets/colors/colors";

const CustomTextInput = ({ Bool, Submit }) => {
  const [textValue, setTextValue] = useState("");
  return (
    <View
      style={{
        borderTopWidth: 0.2,
        minHeight: 60,
        alignItems: "center",
        width: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
      }}
    >
      <TextInput
        style={{
          width: "80%",
          borderWidth: 0.5,
          height: "80%",
          overflow: "scroll",
          paddingHorizontal: 10,
          borderRadius: 30,
        }}
        value={textValue}
        placeholder="Enter message ..."
        onChangeText={(value) => {
          setTextValue(value);
          console.log(textValue)
        }}
      />
      <Ionicons
        onPress={() => {
            if (Submit) {
                Submit(textValue); // Call Submit with the current textValue
                setTextValue(""); // Clear the TextInput after submission
              }
        }}
        style={{
          padding: 12,
          borderWidth: 0.2,
          borderRadius: 50,
          backgroundColor: Bool
            ? Themes.patientTheme.primaryColor
            : Themes.doctorTheme.primaryColor,
        }}
        color={"white"}
        size={25}
        name="send"
      />
    </View>
  );
};

export default CustomTextInput;
