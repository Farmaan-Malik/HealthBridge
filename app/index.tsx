// Import React Hooks
import React, { useRef, useState, useEffect } from 'react';
// Import user interface elements
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Switch,
} from 'react-native';
// Import components related to obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';
// Import Agora SDK
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    IRtcEngine,
    RtcSurfaceView,
    RtcConnection,
    IRtcEngineEventHandler,
} from 'react-native-agora';


// Define basic information
const appId = 'a48b2c9573b34ec7894cb6ff85f7bbfc';
const token = '007eJxTYPizk0WI6diDu54Csmcfclc9EtnneFTrRIhQkz575szA8OkKDIkmFklGyZam5sZJxiapyeYWlibJSWZpaRamaeZJSWnJCQtd0hsCGRkcvy5gYWSAQBCflcEjNScnn4EBAAreHtM=';
const channelName = 'Hello';
const uid = 0; // Local user Uid, no need to modify

export default function index(){
    const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
    const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
    const [isHost, setIsHost] = useState(true); // User role
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // User prompt message
    const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
 const [isSuccessful,changeSuccessful] = useState(false)
    agoraEngineRef.current = createAgoraRtcEngine();
const agoraEngine = agoraEngineRef.current;
agoraEngine.initialize({
    appId: appId,
});
const [isMuted,setMuted]=useState(false)
const [isVideo,setVideo]=useState(true)

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
            if (Platform.OS === 'android') {
                await getPermission();
            }
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            eventHandler.current = {
                onJoinChannelSuccess: () => {
                    showMessage('Successfully joined channel: ' + channelName);
                    setIsJoined(true);
                },
                onUserJoined: (_connection: RtcConnection, uid: number) => {
                    showMessage('Remote user ' + uid + ' joined');
                    setRemoteUid(uid);
                },
                onUserOffline: (_connection: RtcConnection, uid: number) => {
                    showMessage('Remote user ' + uid + ' left the channel');
                    setRemoteUid(0);
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
            console.log("error",e);
        }
    };

    const join = async () => {
        if (isJoined) {
            return;
        }
        try {
            if (isHost) {
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
            } else {
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
            }
            changeSuccessful(true)
        } catch (e) {
            console.log(e);
        }
    };
    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            setRemoteUid(0);
            setIsJoined(false);
            showMessage('Left the channel');
            changeSuccessful(false)
        } catch (e) {
            console.log(e);
        }
    };
    const mute = () => {
      try {
        setMuted(!isMuted)
          agoraEngineRef.current?.muteLocalAudioStream(isMuted);

      } catch (e) {
          console.log(e);
      }
  };
    const video = () => {
      try {
        setVideo(!isVideo)
          agoraEngineRef.current?.enableLocalVideo(isVideo);
      } catch (e) {
          console.log(e);
      }
  };

    // Render user interface
    return (
        <SafeAreaView style={styles.main}>
            {!isSuccessful &&
            <>
            <Text style={styles.head}>Agora Video SDK Quickstart</Text>
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
            </View>
            </>}
            <View
                style={styles.scroll}>
                {/* contentContainerStyle={styles.scrollContainer} */}
                {isJoined && (
                  <View >
                    <React.Fragment key={0}>
                        {/* Create a local view using RtcSurfaceView */}
                        <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.remoteView} />
                        {/* <Text>Local user uid: {uid}</Text> */}
                    </React.Fragment>
                    <Text onPress={leave} style={styles.button2}>
                    Leave Channel
                </Text>
                    </View>
                // )
                //  : (
                //     <Text>Join a channel</Text>
                )}
                {isJoined && remoteUid!==0 ? (
                  <View>
                    <React.Fragment key={remoteUid}>
                        {/* Create a remote view using RtcSurfaceView */}
                        <RtcSurfaceView
                            canvas={{ uid: 0 }}
                            style={styles.videoView}
                        />
                        {/* <Text>Remote user uid: {remoteUid}</Text> */}
                    </React.Fragment>
                    <Text onPress={leave} style={styles.button2}>
                    Leave Channel
                </Text>
                    {/* <Text onPress={mute} style={styles.button3}>
                   mute
                </Text> */}
                    <Text onPress={video} style={styles.button3}>
                   video
                </Text>

                    </View>
                ) 
                : (
                    <Text>{isJoined && !isHost ? 'Waiting for remote user to join' : ''}</Text>
                )
                }
                <Text style={styles.info}>{message}</Text>
            </View>
        </SafeAreaView>
    );

    // Display information
    function showMessage(msg: string) {
        setMessage(msg);
    }
};

// Define user interface styles
const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 25,
        paddingVertical: 4,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#0055cc',
        margin: 5,
    },
    main: { flex: 1, alignItems: 'center' },
    scroll: { flex: 1, backgroundColor: '#ddeeff', width: '100%', height:'100%', position:"relative" },
    scrollContainer: { alignItems: 'center' },
    videoView: { width: 100, height:200, position:"absolute", bottom:30,right:0, zIndex:3 },
    remoteView: { width: '100%', height: '90%',zIndex:1 },

    btnContainer: { flexDirection: 'row', justifyContent: 'center' },
    head: { fontSize: 20 },
    info: { backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff' },
    button2:{position: "absolute", bottom:0},
    button3:{position: "absolute", bottom:0, right:0},
    button4:{position: "absolute", bottom:0, marginLeft:"20%"}
});

const getPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
    }
};

