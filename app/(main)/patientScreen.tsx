// Import React Hooks
import globalStyles from "@/assets/styles/globalsStyles";
import React, { useRef, useState, useEffect } from "react";
import CustomCard from "../../components/customCards";
import PatientCard from "../../components/patientCard";
import DoctorCard from "../../components/doctorCard";
// Import user interface elements
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import components related to obtaining Android device permissions
import { PermissionsAndroid, Platform } from "react-native";
// Import Agora SDK
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
  RemoteVideoState,
  RemoteVideoStateReason,
} from "react-native-agora";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/header";
import { router } from "expo-router";

const patient = require("../../assets/images/patientPlaceHolder.png");

// Define basic information
const appId = "a48b2c9573b34ec7894cb6ff85f7bbfc";
const token =
  "007eJxTYJBa6zR1lyrf3A9vOub8j6sts2l8asfqcfBsBeP6CcpLP1xWYEg0sUgySrY0NTdOMjZJTTa3sDRJTjJLS7MwTTNPSkpL9vjmmt4QyMjgtDqEmZEBAkF8VgaP1JycfAYGALsMIO0=";
const channelName = "Hello";
const uid = 0; // Local user Uid, no need to modify

export default function index() {
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [isControlVisible, setControlVisible] = useState(false);
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
  const [isSuccessful, changeSuccessful] = useState(false);
  agoraEngineRef.current = createAgoraRtcEngine();
  const agoraEngine = agoraEngineRef.current;
  agoraEngine.initialize({
    appId: appId,
  });
  const [isRemoteVideoDisabled, updateRemoteVideoDisabled] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [isVideoEnabled, setVideoEnabled] = useState(true);

  const controlCentre = () => {
    setControlVisible(!isControlVisible);
  };

  useEffect(() => {
    // Initialize the engine when the App starts
    setupVideoSDKEngine();
    // Release memory when the App is closed
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    };
  }, []);

  // Define the setupVideoSDKEngine method called when the App starts
  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions
      if (Platform.OS === "android") {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: () => {
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          setRemoteUid(0);
          leave()
        },
        onRemoteVideoStateChanged: (
          connection: RtcConnection,
          remoteUid: number,
          state: RemoteVideoState,
          reason: RemoteVideoStateReason,
          elapsed: number
        ) => {
          if (
            reason == RemoteVideoStateReason.RemoteVideoStateReasonRemoteMuted
          ) {
            console.log("video disabled");
            updateRemoteVideoDisabled(true);
          }
          if (
            reason == RemoteVideoStateReason.RemoteVideoStateReasonRemoteUnmuted
          ) {
            console.log("video enabled");
            updateRemoteVideoDisabled(false);
          }
        },
        
      };

      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
      // Enable local video
      agoraEngine.enableVideo();
    } catch (e) {
      console.log("error", e);
    }
  };

  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
        // Join the channel as an audience
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to audience
          clientRoleType: ClientRoleType.ClientRoleAudience,
          // Do not publish audio collected by the microphone
          publishMicrophoneTrack: true,
          // Do not publish video collected by the camera
          publishCameraTrack: true,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
        });
      changeSuccessful(true);
      setMuted(false);
      setVideoEnabled(true);
      updateRemoteVideoDisabled(false);
    } catch (e) {
      console.log(e);
    }
  };
  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      changeSuccessful(false);
    } catch (e) {
      console.log(e);
    }
  };
  const mute = () => {
    setMuted((prevMuted) => {
      agoraEngineRef.current?.muteLocalAudioStream(!prevMuted);
      return !prevMuted;
    });
  };
  const video = () => {
    setVideoEnabled((prevEnabled) => {
      agoraEngineRef.current?.enableLocalVideo(!prevEnabled);
      return !prevEnabled;
    });
  };

  // Render user interface
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {!isSuccessful && (
          <>       
        <Header height={"5%"} doctor={false} onPress={()=>{router.back()}}/>           
            <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: Platform.OS === "android" ? 30 : 5, // Prevent bottom clipping
            }}
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "100%",
              flex: 1,
              // paddingTop: 30,
              // marginBottom:10
            }}
          >
            <CustomCard isDoctor={false} image={patient} name="Patient Terry" profession="30yr , Male"/>
            <View
              style={{
                width: "80%",
                borderWidth: 0.3,
                borderStyle: "dashed",
                marginTop: 20,
                alignSelf: "center",
              }}
            ></View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                marginTop: 10,
                width: "90%",
                marginStart: 10,
              }}
            >
              Doctor List:
            </Text>
            <PatientCard
            onPress={() => {
              join();
            }}
            name={"Dr. Peralta"}
            isDoctor={false}
            />
          <PatientCard
            onPress={() => {
              join();
            }}
            name={"Dr. Adrian Pimento"}
            isDoctor={false}
            />
  
            {/* <Text style={styles.head}>Agora Video SDK Quickstart</Text>
              <View style={styles.btnContainer}>
                  <Text onPress={join} style={styles.button}>
                      Join Channel
                  </Text>
                  
              </View>
              <View style={styles.btnContainer}>
                  <Text>Audience</Text>
                  <Switch
                      onValueChange={switchValue => {
                          setIsHost(switchValue);
                          if (isJoined) {
                              leave();
                          }
                      }}
                      value={isHost}
                  />
                  <Text>Host</Text>
              </View> */}
          </ScrollView>
          </>
        // <View
       
        //   style={{
        //     backgroundColor: "white",
        //     width: "100%",
        //     height: "100%",
        //     flex: 1,
        //     // paddingHorizontal: 10,
        //     display:'flex',
        //     alignItems:'center'
        //     // paddingTop: 30,
        //     // marginBottom:10
        //   }}
        // >
        //   <View
        //     style={{
        //       height: "10%",
        //       width: "100%",
        //       backgroundColor: "white",
        //       display:'flex',
        //       flexDirection:'row',
        //       alignItems:'center',
        //       justifyContent:'flex-end',

        //     }}
        //   >
        //     <Header height={"100%"} doctor={false} onPress={()=>{router.back()}}/>
        //   </View>
        //   <DoctorCard
        //   name={"Dr. Peralta"}
        // //   left={"30"}
        //     onPress={() => {
        //       join();
        //       setIsHost(false);
        //     }}
        //     height={"40%"}
        //     width={"80%"}
        //     image={doctor}
        //   />
        //   <DoctorCard
        //   name={"Dr. Adrian Pimento"}
        // //   left={"30"}
        //     onPress={() => {
        //       join();
        //       setIsHost(false);
        //     }}
        //     height={"40%"}
        //     width={"80%"}
        //     image={doctor}
        //   />
          
        // </View>
      )}
      {isSuccessful && (
        <View style={[globalStyles.screens, { position: "relative" }]}>
          {/* contentContainerStyle={styles.scrollContainer} */}
          {isJoined && (
            <View>
              {!isRemoteVideoDisabled ? (
                <TouchableOpacity activeOpacity={1} onPress={controlCentre}>
                  <React.Fragment key={0}>
                    {/* Create a local view using RtcSurfaceView */}
                    <RtcSurfaceView
                      canvas={{ uid: remoteUid }}
                      style={styles.remoteView}
                    />
                  </React.Fragment>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={controlCentre}
                  style={{
                    zIndex: 1,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ zIndex: 1, width: 300, height: 300 }}
                    source={require("../../assets/images/cameraOffDoc.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {isJoined && remoteUid !== 0 ? (
            <View style={[globalStyles.screens]}>
              {isVideoEnabled ? (
                <View>
                  <React.Fragment key={remoteUid}>
                    {/* Create a remote view using RtcSurfaceView */}
                    <RtcSurfaceView
                      canvas={{ uid: 0 }}
                      style={[
                        styles.videoView,
                        { bottom: isControlVisible ? 120 : 30,borderWidth:0.1 },
                      ]}
                    />
                  </React.Fragment>
                </View>
              ) : ( 
                <View style={[
                    styles.videoView,
                    { bottom: isControlVisible ? 120 : 30, borderWidth:0.1,backgroundColor:'white' },
                  ]}>
                    <View style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{ zIndex: 4, width: 100, height: 100 }}
                    source={require('../../assets/images/cameraOffPat.png')}/>
                    </View>
                </View>
              )}
            </View>
          ) : (
            <></>
          )}
          {isControlVisible && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                width: "100%",
                borderWidth: 1,
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
                backgroundColor: "black",
                height: "15%",
                position: "absolute",
                zIndex: 5,
                justifyContent: "space-around",
                alignItems: "center",
                bottom: -15,
              }}
            >
              <TouchableOpacity onPress={mute}>
                <Ionicons
                  size={50}
                  color={"white"}
                  name={isMuted ? "mic-off" : "mic"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={leave}
                style={{
                  borderWidth: 2,
                  borderColor: "red",
                  borderRadius: 100,
                  padding: 10,
                  overflow: "hidden",
                  backgroundColor: "red",
                }}
              >
                <Ionicons size={40} color={"white"} name="call" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => video()}>
                <Ionicons
                  size={40}
                  color={"white"}
                  name={isVideoEnabled ? "videocam" : "videocam-off"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* <Text style={styles.info}>{message}</Text> */}
        </View>
      )}
    </SafeAreaView>
  );

}

// Define user interface styles
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#0055cc",
    margin: 5,
  },
  main: { flex: 1, alignItems: "center" },
  scroll: {
    flex: 1,
    backgroundColor: "#ddeeff",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  scrollContainer: { alignItems: "center" },
  videoView: {
    width: 100,
    height: 200,
    position: "absolute",
    borderRadius: 10,
    right: 10,
    zIndex: 4,
    overflow: "hidden",
  },
  remoteView: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    backgroundColor: "#333333",
  },

  btnContainer: { flexDirection: "row", justifyContent: "center" },
  head: { fontSize: 20 },
  info: { backgroundColor: "#ffffe0", paddingHorizontal: 8, color: "#0000ff" },
  button2: { color: "white" },
  button3: {},
  button4: {},
});

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};
