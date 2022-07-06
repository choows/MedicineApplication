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


PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
    if (notification.action == "Snooze") {
      var oldDateObj = new Date();
      var newDateObj = new Date();
      newDateObj.setTime(oldDateObj.getTime() + (1 * 60 * 1000));//snooze 1 min
      PushNotification.localNotificationSchedule({
        channelId: notification.channelId,
        //... You can use all the options from localNotifications
        message: notification.message, // (required)
        bigText: notification.bigText, // (optional) default: "message" prop
        subText: notification.subText,
        date: newDateObj,
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        actions: ["Dismiss", "Snooze", "Take"],
        invokeApp: false,
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      });
    }

    if (notification.action == "Take") {
      //take 
      firebase.database().ref(notification.subText).once('value').then((resp) => {
        console.log("Data : " + JSON.stringify(resp));
        var d = resp.val();
        d.Active = false;
        console.log("Data 2 : " + JSON.stringify(d));
        firebase.database().ref(notification.subText).set(d).then((r) => {
          // console.log("Updated");
          ShowNormalAlert("" , d.Name + " Taken");
        }).catch((exp) => {
          console.log("Error : " + exp);
        })

      });
    }
    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,

});

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
