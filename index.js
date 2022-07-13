/**
 * @format
 */
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { firebase } from '@react-native-firebase/database';
import { ShowNormalAlert } from "./CommonFunction/Alert";




PushNotification.createChannel(
  {
    channelId: "RN-Channel", // (required)
    channelName: "Medical 2R ", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

AppRegistry.registerComponent(appName, () => App);
