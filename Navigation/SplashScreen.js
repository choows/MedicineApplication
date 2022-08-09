import * as React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import PushNotification from "react-native-push-notification";
import { firebase } from '@react-native-firebase/database';

function SplashScreen({ navigation }) {

  React.useEffect(() => {

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
          /**
           * 
           * 
          navigation.navigate('Main', {
          screen: 'ViewMedicine',
          params: {  user: JSON.stringify(resp.user) },
        })
        
           */

          // navigation.navigate('Main', {
          //   screen: 'ViewMedicine',
          //   params: { url : notification.subText },
          // })

          firebase.database().ref(notification.subText).once('value').then((resp) => {
            console.log("Data : " + JSON.stringify(resp));
            navigation.navigate('Main', {
              screen: 'ViewMedicine',
              params: { medicine : JSON.stringify(resp.val()) , url :  notification.subText},
            })

            // var d = resp.val();
            // d.Active = false;
            // console.log("Data 2 : " + JSON.stringify(d));
            // firebase.database().ref(notification.subText).set(d).then((r) => {
            //   // console.log("Updated");
            //   ShowNormalAlert("", d.Name + " Taken");
            // }).catch((exp) => {
            //   console.log("Error : " + exp);
            // })

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
  }, []);

  const onPress = () => {
    navigation.navigate('Login')
  }


  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Medical 2R & First Aid</Text>
      <Image style={styles.ImageStyle} source={require('../Images/HomePage.jpg')} />
      <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
        <Text style={styles.buttonfont}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ABECEE',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    backgroundColor: '#FEFBAC',
    padding: 15,
    marginTop:20
  },
  buttonfont: {
    fontSize: 25,
    color: 'blue',
    fontWeight: '500'
  },
  ImageStyle: {
    width: '100%',
    resizeMode: 'stretch',
    height: '50%'
  },
  Header: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold'
  }
});
export default SplashScreen;