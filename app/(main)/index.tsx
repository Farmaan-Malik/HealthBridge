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
  KeyboardAvoidingView,
  Button,
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
  ErrorCodeType,
  QualityType,
} from "react-native-agora";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import CustomMessageBox from "@/components/customMessageBox";
import Themes from "@/assets/colors/colors";
import { SocketInstance } from "../index";

const appId = "a48b2c9573b34ec7894cb6ff85f7bbfc";
const token =
"007eJxTYOCTiEw+VvbgC880zcO8C3l0M1Z8jG3QPXeZ23vvsQkTXSYpMCSaWCQZJVuamhsnGZukJptbWJokJ5mlpVmYppknJaUlT57kmd4QyMjQLOvHxMgAgSA+K4NHak5OPgMDACh5HvE=";
const channelName = "Hello";
const uid = 0;
const socket = SocketInstance;
const doctor = require("../../assets/images/doctorProfile.png");

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};

export default function index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [badNetwork, setBadNetwork] = useState(false);
  const agoraEngineRef = useRef<IRtcEngine>(); 
  const [isJoined, setIsJoined] = useState(false); 
  const [isHost, setIsHost] = useState(true); 
  const [remoteUid, setRemoteUid] = useState(0);
  const eventHandler = useRef<IRtcEngineEventHandler>();
  const [isSuccessful, changeSuccessful] = useState(false);
  const [isControlVisible, setControlVisible] = useState(false);
  const [isMessageOpen, setMessageOpen] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isRemoteVideoDisabled, updateRemoteVideoDisabled] = useState(false);
  const role = "doctor";

  type Message = {
    role: string;
    message: string;
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const messagePayload = {
        role: role,
        message: currentMessage.trim(),
      };
      socket!.emit("message", messagePayload); 
      setCurrentMessage(""); 
    }
  };
  useEffect(() => {
    // Listen for incoming messages
    socket!.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("recieved", message);
    });
    socket.on("endCall", () => {
      leave();
    });
    console.log("messages", messages);
  }, []);

  agoraEngineRef.current = createAgoraRtcEngine();
  const agoraEngine = agoraEngineRef.current;
  agoraEngine.initialize({
    appId: appId,
  });

  const controlCentre = () => {
    setControlVisible(!isControlVisible);
  };
  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
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
          leave();
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
        onError: (err: ErrorCodeType, msg: string) => {
          if (err == ErrorCodeType.ErrTokenExpired) {
            alert("Token has expired");
            leave();
          } else if (err == ErrorCodeType.ErrInvalidToken) {
            alert("Invalid Token");
            leave();
          } else {
            alert("Error has occured");
            leave();
          }
        },
        onNetworkQuality: (
          connection: RtcConnection,
          remoteUid: number,
          txQuality: QualityType,
          rxQuality: QualityType
        ) => {
          if (txQuality >= 4 || rxQuality >= 4) {
            setBadNetwork(true);
          }
        },
      };
      agoraEngine.registerEventHandler(eventHandler.current);
      agoraEngine.initialize({
        appId: appId,
      });
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
      socket!.emit("videoCall", {
        name: "Dr. Peralta",
        appointment: "VideoCall",
      });

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
      });
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
      setVideoEnabled(true)
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

  const router = useExpoRouter();
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {!isSuccessful && (
        <>
          <Header
            onPress={() => {
              router.goBack();
            }}
            doctor={true}
          />
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
          {badNetwork && (
            <View
              style={{
                position: "absolute",
                bottom: "50%",
                left: "25%",
                zIndex: 6,
                borderRadius: 20,
                width: "50%",
                padding: 10,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Bad Network Connection
              </Text>
              <Button
                onPress={() => setBadNetwork(false)}
                title="Dismiss"
              ></Button>
            </View>
          )}
          {isJoined && (
            <View>
              {isMessageOpen ? (
                <KeyboardAvoidingView
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingBottom: 30,
                    position: "relative",
                    zIndex: 5,
                  }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={20}
                >
                  <View
                    style={{ display: "flex", marginEnd: 10, marginBottom: 10 }}
                  >
                    <Ionicons
                      onPress={() => setMessageOpen(false)}
                      color={Themes.doctorTheme.primaryColor}
                      style={{
                        elevation: 10,
                        padding: 8,
                        borderRadius: 50,
                        shadowColor: "black",
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 5, height: 5 },
                        backgroundColor: "white",
                        alignSelf: "flex-end",
                      }}
                      size={20}
                      name="close"
                    />
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
                      value={currentMessage} 
                      placeholder="Enter message ..."
                      onChangeText={(newValue) => setCurrentMessage(newValue)} 
                    />
                    <Ionicons
                      onPress={sendMessage}
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
                </KeyboardAvoidingView>
              ) : !isRemoteVideoDisabled ? (
                <TouchableOpacity activeOpacity={1} onPress={controlCentre}>
                  <React.Fragment key={0}>
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
                    source={require("../../assets/images/cameraOffPat.png")}
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
                    <RtcSurfaceView
                      canvas={{ uid: 0 }}
                      style={[
                        styles.videoView,
                        { bottom: isControlVisible ? 120 : 30 },
                      ]}
                    />
                  </React.Fragment>
                </View>
              ) : (
                <View
                  style={[
                    styles.videoView,
                    {
                      bottom: isControlVisible ? 120 : 30,
                      borderWidth: 0.1,
                      backgroundColor: "white",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ zIndex: 4, width: 100, height: 100 }}
                      source={require("../../assets/images/cameraOffDoc.png")}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
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
              <TouchableOpacity onPress={() => video()}>
                <Ionicons
                  size={40}
                  color={"white"}
                  name={isVideoEnabled ? "videocam" : "videocam-off"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMessageOpen(true);
                  setControlVisible(false);
                }}
              >
                <Ionicons size={40} color={"white"} name={"chatbox"} />
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
});