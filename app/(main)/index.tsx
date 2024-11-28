import globalStyles from "@/assets/styles/globalsStyles";
import React, { useRef, useState, useEffect } from "react";
import CustomCard from "../../components/customCards";
import PatientCard from "../../components/patientCard";
import Header from "../../components/header";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { PermissionsAndroid, Platform } from "react-native";
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
import io, { Socket } from "socket.io-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import CustomMessageBox from "@/components/customMessageBox";
import Themes from "@/assets/colors/colors";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { SocketInstance } from "../index";

const doctor = require("../../assets/images/doctorProfile.png");

// Define basic information
const appId = "a48b2c9573b34ec7894cb6ff85f7bbfc";
const token ="007eJxTYLj60LHp4G/1yZ/meRn/Tjo7x3xzduEksx8iAnWfZq1uKr2nwJBoYpFklGxpam6cZGySmmxuYWmSnGSWlmZhmmaelJSWbD3DPb0hkJFhu4sKKyMDBIL4rAweqTk5+QwMADp4IeQ="
const channelName = "Hello";
const uid = 0; // Local user Uid, no need to modify
const socket = SocketInstance

export default function index() {
  // useEffect(()=>{
  //   socket.off('connection')
  // },[])
  type Message = {
    role: string;
    message: string;
  };
  const role = "doctor";

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  // Function to send a message
  const sendMessage = () => {
    if (currentMessage.trim()) {
      // Prevent empty or whitespace-only messages
      const messagePayload = {
        role: role,
        message: currentMessage.trim(),
      };
      socket!.emit("message", messagePayload); // Emit the message to the server
      setCurrentMessage(""); // Clear the input field after sending
    }
  };
  useEffect(() => {
    // Listen for incoming messages
    socket!.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("recieved", message);
    });
    socket.on('endCall',()=>{
      leave()
    })
    console.log("messages", messages);
  }, []);
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [isHost, setIsHost] = useState(true); // User role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
  const [isSuccessful, changeSuccessful] = useState(false);
  const [isControlVisible, setControlVisible] = useState(false);
  const [isMessageOpen, setMessageOpen] = useState(false);

  agoraEngineRef.current = createAgoraRtcEngine();
  const agoraEngine = agoraEngineRef.current;
  agoraEngine.initialize({
    appId: appId,
  });
  const [isMuted, setMuted] = useState(false);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isRemoteVideoDisabled, updateRemoteVideoDisabled] = useState(false);

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
      socket!.emit("videoCall",{name:"Dr. Peralta",appointment:"VideoCall"})

        // Start preview
        agoraEngineRef.current?.startPreview();
        // Join the channel as a broadcaster
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to broadcaster
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          // Publish audio collected by the microphone
          publishMicrophoneTrack: true,
          // Publish video collected by the camera
          publishCameraTrack: true,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
        })
      changeSuccessful(true);
      setMuted(false);
      setVideoEnabled(true);
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
      updateRemoteVideoDisabled(false);

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

  const router = useExpoRouter()
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {!isSuccessful && (
        <>       
        <Header onPress={()=>{router.goBack()}} doctor={true}/>
         <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === "android" ? 30 : 5,
          }}
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "100%",
            flex: 1,
          }}
        >
          <CustomCard image={doctor} />
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
            Patient List:
          </Text>
          <PatientCard
            onPress={() => {
              join();
              setIsHost(true);
            }}
            name={"Charles Boyle"}
          />
          <PatientCard
            onPress={() => {
              join();
              setIsHost(true);
            }}
            name={"Doug Judy"}
          />
          <PatientCard
            onPress={() => {
              join();
              setIsHost(true);
            }}
            name={"Rosa Diaz"}
          />
          <PatientCard
            onPress={() => {
              join();
              setIsHost(true);
            }}
            name={"Norm Scully"}
          />
        </ScrollView>
        </>

      )}
      {isSuccessful && (
        <View
          style={[
            globalStyles.screens,
            { paddingTop: 30, position: "relative" },
          ]}
        >
          {isJoined && (
            <View>
              {isMessageOpen ? (
                <KeyboardAvoidingView
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingBottom: 30,
                    position: "relative",
                  }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={20}
                >
                   <View style={{display:'flex',marginEnd:10,marginBottom:10}}>
                      <Ionicons onPress={()=>setMessageOpen(false)} color={Themes.doctorTheme.primaryColor} style={{elevation:10,padding:8,borderRadius:50,shadowColor:'black',shadowOpacity:0.3,shadowOffset:{width:5,height:5},backgroundColor:'white',alignSelf:'flex-end'}} size={20} name='close' />
                    </View>
                  <ScrollView
                    contentContainerStyle={{
                      width: "100%",
                      paddingHorizontal: 8,
                      paddingBottom: 100,
                    }}
                  >
                   
                    {messages.map((message, index) => (
                      <CustomMessageBox
                        key={index}
                        Message={message}
                        role={"doctor"}
                      />
                    ))}
                  </ScrollView>
                  {/*  */}
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
                      value={currentMessage} // Use currentMessage state
                      placeholder="Enter message ..."
                      onChangeText={(newValue) => setCurrentMessage(newValue)} // Update state on input change
                    />
                    <Ionicons
                      onPress={sendMessage} // Correct function call
                      style={{
                        padding: 12,
                        borderWidth: 0.2,
                        borderRadius: 50,
                        backgroundColor: Themes.doctorTheme.primaryColor,
                      }}
                      color={"white"}
                      size={25}
                      name="send"
                    />
                  </View>

                  {/*  */}
                  {/* <CustomTextInput
                    Submit={() => {
                      sendMessage();
                    }}
                    Bool={true}
                  /> */}
                </KeyboardAvoidingView>
              ) : !isRemoteVideoDisabled ? (
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
          {isJoined && remoteUid !== 0 && (
            <View style={[globalStyles.screens]}>
                 {isVideoEnabled ? (
                <View>

              <React.Fragment key={remoteUid}>
                {/* Create a remote view using RtcSurfaceView */}
                <RtcSurfaceView
                  canvas={{ uid: 0 }}
                  style={[
                    styles.videoView,
                    { bottom: isControlVisible ? 120 : 30 },
                  ]}
                />
                {/* <Text>Remote user uid: {remoteUid}</Text> */}
              </React.Fragment>
              </View>
               ) : (
                <View style={[
                    styles.videoView,
                    { bottom: isControlVisible ? 120 : 30, borderWidth:0.1,backgroundColor:'white' },
                  ]}>
                    <View style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{ zIndex: 4, width: 100, height: 100 }}
                    source={require('../../assets/images/cameraOffDoc.png')}/>
                    </View>
                </View>
              )}
            </View>
          )
          }
          {isControlVisible && (
           <View
           style={{
             display: "flex",
             flexDirection: "row",
             gap: 10,
             width: "100%",
             borderWidth: 1,
             borderRadius: 40,
             backgroundColor: "black",
             height: "10%",
             position: "absolute",
             zIndex: 5,
             justifyContent: "space-around",
             alignItems: "center",
             bottom: 5,
           }}
         >
           <TouchableOpacity onPress={mute}>
          <Ionicons
            size={50}
            color={"white"}
            name={isMuted ? "mic-off" : "mic"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>video()}>
          <Ionicons
            size={40}
            color={"white"}
            name={isVideoEnabled ? "videocam" : "videocam-off"}
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>{
             setMessageOpen(true)
             setControlVisible(false)
           }}>
             <Ionicons
               size={40}
               color={"white"}
               name={'chatbox'}
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
         </View>
       )}
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
