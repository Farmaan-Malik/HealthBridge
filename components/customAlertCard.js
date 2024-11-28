import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Themes from "@/assets/colors/colors";

const CustomAlertCard = ({name,isAlert = false,onReject,onAccept}) => {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal:10,
        paddingVertical:30,
        borderRadius: 30,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:'center',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: "white",
        marginTop: 20,
        elevation:10
    }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "500"}}>
          Name: {name}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "300", marginTop:8 }}>
          Appointment: 30th November
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "300", marginTop:2 }}>Time: 1:15 PM</Text>
        <Text style={{ fontSize: 15, fontWeight: "300", marginTop:2 }}>
          Consultation type: Video
        </Text>
      </View>
   {isAlert && (
    <View style={{gap:10}}> 
        <TouchableOpacity
        style={{
          width: 50,
          height:50,
          borderRadius: 30,
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          backgroundColor: "#4CBB17",
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          elevation:10
        }}
        onPress={onAccept}
      >
        <Ionicons color={'white'} style={{alignSelf:'center'}} size={30} name='call'/>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 50,
          height:50,
          borderRadius: 30,
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          backgroundColor: "red",
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          elevation:10
        }}
        onPress={onReject}
      >
        <Ionicons color={'white'} style={{alignSelf:'center', transform: [{ rotate: '140deg'}]}} size={30} name="call"/>
      </TouchableOpacity>
      </View>)}
    </View>
  );
};

export default CustomAlertCard;
