# Overview

 The Video Consultation App enables users to log in as either a Patient or a Doctor. Depending on the selected role, the app offers distinct features and a unique color theme for a personalized experience. The application is built using React Native Expo with real-time communication powered by Agora and Socket.IO.


## Features

- **Real-Time Video Calls**: 
  - Utilizes Agora SDK for real-time video and audio communication.
  - Handles token expiration and invalid token scenarios gracefully.
  - Enables users to mute their microphones and disable camera.
  - Placeholders for when a user's camera is disabled.
  - End call buton ends the call for both users.
- **Real-Time Messaging**: 
  - Uses Socket.IO for real-time communication between clients.
  - Different color themes for text boxes to distinguish between user messages and remote messages.
- **Cross-Platform Support**: 
  - Works seamlessly on Android and iOS devices.
- **Notifications**:
  - Notification for when a doctor initiates a call with the patient in the form of dynamic buttons that appear in the Patient Dashboard with the          option to accept or reject the call.

---

## Tech Stack

### Frontend
- **React Native** (with Expo)
- **Agora SDK** (for video calls)
- **Socket.IO Client**

### Backend
- **Node.js** (server-side runtime)
- **Express.js** (framework for the REST API)
- **Socket.IO** (real-time communication)

### Backend Hosted on *Koyeb*
---

## Prerequisites

1. Install **Node.js**.
2. Install **Expo CLI**.
3. Set up an **Agora.io** account to get your App ID and Token generation credentials.
4. Install **Java JDK** and Android Studio for Android development.

---
## Clone the Repository
```bash
git clone https://github.com/Farmaan-Malik/essenZvita_Assignment
```
## Setup Instructions
Install Dependencies and prebuild
```bash
npm install
```
```bash
npx expo prebuild
```
## Configure Agora SDK
- Sign up at Agora.io and create a project.
- Replace "appId" in the source code with your Agora App ID for both (main)/patientScreen and (main)/index.
- Generate a temporary token in Agora console and replace the "token" constant's value with your temporary token.

## Run the Application
### Run on Android
```bash
npx expo run:android
```
### Run on IOS
```bash
npx expo run:ios
```
## Challenges Faced
### Integrating Agora for Real-Time Video Communication
Integrating Agora for real-time video and audio calls posed a significant challenge due to the complexity of the SDK and the configuration required for a seamless experience. Ensuring smooth communication between the front end and Agora's backend, along with proper management of video and audio streams, was crucial to avoid connectivity issues. Additionally, making sure that the video call was stable, even in low network conditions, required optimizations and error handling to manage disruptions during calls.

### Handling Real-Time Notifications with Socket.IO
Implementing real-time notifications using Socket.IO required setting up a reliable communication channel between the front end (React Native) and the backend (Node.js). One of the main challenges was ensuring that notifications were delivered in real-time to both doctors and patients without any delays. Handling scenarios like multiple clients connected at once, ensuring that messages were sent to the correct user, and managing socket disconnections were key concerns that had to be addressed.

### Managing Different User Roles (Doctor and Patient)
The app needed to support two different user roles with distinct color themes, layouts, and functionalities. The challenge was in handling dynamic theme changes when the user switched between being a Doctor and a Patient. Ensuring that each user’s experience was customized while maintaining the app's integrity across both roles required proper state management and conditional rendering. Moreover, the user interface had to adapt smoothly to both roles without breaking the overall user experience.

### Synchronizing Backend and Frontend
Ensuring seamless communication between the Node.js backend and the React Native front-end posed challenges, especially during video call sessions. Synchronizing socket events between multiple clients (doctors and patients), ensuring data consistency (such as user info and call status), and efficiently broadcasting events, required a solid understanding of both front-end and back-end technologies.

### Debugging Complex Real-Time Features
Testing and debugging real-time communication features like video calls and notifications in development mode was particularly challenging. Issues like poor network connectivity, device incompatibility, and delayed notification delivery had to be addressed. Utilizing Expo’s debugging tools and Agora’s logging features helped identify issues quickly, but frequent testing on multiple devices was crucial to ensuring consistent performance.

### Testing on Real Devices
The app had to be tested on real devices rather than emulators due to the complexity of features like real-time video calls, notifications, and device-specific functionalities. Some features, particularly Agora’s video calls, did not work properly on ios emulator and required actual hardware for testing. Ensuring that the app was fully functional on various devices with different specifications and operating systems was an essential part of the development process to avoid potential issues in production.

# Note:
As mentioned above, the app should be tested on real devices for the video call feature.

<Div>
<img width=200 src="./image1.png"/>
<img width=300 src="./image2.png"/>
<img width=300 src="./image3.png"/>
</Div>
 <Div>
<img width=300 src="./image5.png"/>
<img width=300 src="./image4.png"/>
<img width=300 src="./image6.png"/>
 </Div>
  <Div>
<img width=200 src="./image7.png"/>
<img width=200 src="./image9.PNG"/>
<img width=200 src="./image10.PNG"/>
  </Div>
   <Div>
<img width=200 src="./image11.PNG"/>
<img width=200 src="./image12.PNG"/>
<img width=200 src="./image13.png"/>
   </Div>
 <Div>
<img width=200 src="./image14.png"/>
<img width=200 src="./image15.png"/>
 </Div>




