import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

export async function onDisplayNotification() {
    console.log("hehe")
    // Request permissions (required for iOS)
    await notifee.requestPermission()
    // await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log(token)
  

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }


  //https://github.com/firebase/firebase-ios-sdk