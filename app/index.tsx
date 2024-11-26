import {
  View,
  Text,
  Switch,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/customButton";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../assets/styles/globalsStyles";
import Themes from "@/assets/colors/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useExpoRouter } from "expo-router/build/global-state/router-store";

const index = () => {
    const router = useExpoRouter()
  const patient = require("../assets/images/patient.png");
  const doctor = require("../assets/images/doctor.png");
  const [isDoctor, setDoctor] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function loginDoctor() {
    console.log("login Doctor");
    router.navigate('(main)/')
  }

  function loginPatient() {
    console.log("login Patient");
    router.navigate('(main)/patientScreen')


  }
  // useEffect(()=>{
  //   setTimeout(()=>{    router.navigate('(main)/patientScreen')
  //   },1000)

  // },[])

  return (
    <SafeAreaView style={[globalStyles.safeArea]}>
      <KeyboardAvoidingView style={globalStyles.safeArea}  
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}>
      <ScrollView style={[globalStyles.screens]}
      contentContainerStyle={{paddingBottom:20}}>
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {isDoctor ? "Doctor Login" : "Patient Login"}
        </Text>
        <View
          style={{
            height: "70%",
            width: "100%",
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
          }}
        >
          <View style={styles.shadowContainer}>
            <Image style={styles.image} source={isDoctor ? doctor : patient} />
          </View>
          <View style={{ width: "100%", height: "40%", marginTop:30 }}>
            <Text style={{ fontSize: 15 }}>Username</Text>
            <TextInput
              style={{
                borderWidth: 2,
                height: "30%",
                width: "100%",
                borderRadius: 10,
                padding: 10,
                marginTop: 5,
                fontSize:20
              }}
              value={username}
              autoCapitalize={'none'}
              onChangeText={(value) => setUsername(value)}
            />
            <Text style={{ fontSize: 15, marginTop: 8 }}>Password</Text>
            <View
              style={{
                display: "flex",
                borderWidth: 2,
                borderRadius: 10,
                height: "30%",
                flexDirection: "row",
                marginTop:3
              }}
            >
              <TextInput
                style={{
                  height: "100%",
                  width: "92%",
                  padding: 10,
                  marginTop: 5,
                  alignSelf: "center",
                  fontSize:20
                }}
                autoCapitalize={'none'}
                value={password}
                secureTextEntry={showPassword}
                onChangeText={(value) => setPassword(value)}
              />
              <TouchableOpacity
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons size={20} name={showPassword ? "eye" : "eye-off"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{display:'flex', alignItems:'center',marginTop:50}}>
        <CustomButton
          style={{}}
          width={"50%"}
          height={50}
          doctor={isDoctor}
          text={"Login"}
          onPress={() => {
            if (username == "" || password == "") {
              alert("Enter all the credentials");
            } else if (isDoctor && username == "doctor" && password == "1234") {
              loginDoctor();
            } else if (
              !isDoctor &&
              username == "patient" &&
              password == "5678"
            ) {
              loginPatient();
            } else {
              alert("Invalid Credentials");
            }
          }}
        />
        <TouchableOpacity style={{marginTop:30,marginBottom:30}} onPress={()=>{setDoctor(!isDoctor)}}>
          <Text  style={{ fontSize: 18, fontWeight:'600',textDecorationLine:'underline',color:!isDoctor ? Themes.doctorTheme.primaryColor : Themes.patientTheme.primaryColor }}>
            Sign In as a {isDoctor ? "Patient" : "Doctor"} instead
          </Text>
          </TouchableOpacity>
        {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 30,
            alignItems: "center",
            width: "100%",
            gap: 30,
            justifyContent: "center",
            borderWidth:1
          }}
        > */}
          
          {/* <Switch
            trackColor={{
              false: Themes.doctorTheme.primaryColor,
              true: Themes.patientTheme.secondaryColor,
            }}
            thumbColor={
              isDoctor
                ? Themes.doctorTheme.secondaryColor
                : Themes.patientTheme.secondaryColor
            }
            value={!isDoctor}
            onValueChange={()=>setDoctor(!isDoctor)}
            
          /> */}
        {/* </View> */}
        </View>
        
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  shadowContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    marginTop:20
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
});
