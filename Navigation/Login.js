import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import CommonString, * as CommonMessage from "../CommonFunction/CommonString";
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {


  const [UserEmail, setUserEmail] = React.useState('');
  const [UserPassword, setUserPassword] = React.useState('');

  React.useEffect(() => {
    AsyncStorage.getItem(CommonString.StorageKey.UserCredential).then((resp) => {
      if (resp) {
        var credential = JSON.parse(resp);
        SignIn(credential.Email, credential.Password);

      }

    });
  }, []);

  const ForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  }

  const CreateAccount = () => {
    navigation.navigate('CreateAccount');
  }
  const Login = () => {
    if (!UserEmail) {
      ShowNormalAlert(CommonMessage.default.Login.Failed, CommonMessage.default.Login.EmailRequired);
      return;
    }
    if (!UserPassword) {
      ShowNormalAlert(CommonMessage.default.Login.Failed, CommonMessage.default.Login.PasswordRequired);
      return;
    }
    SignIn(UserEmail, UserPassword);
  }
  const SignIn = (Email, Password) => {
    auth().signInWithEmailAndPassword(Email, Password).then((resp) => {
      if (resp.user) {
        AsyncStorage.setItem(CommonString.StorageKey.UserCredential, JSON.stringify({
          Email: Email,
          Password: Password
        })).then(() => {
          navigation.navigate('Main', {
            screen: 'Home',
            params: { user: JSON.stringify(resp.user) },
          })
        }).catch((exp) => {
          ShowNormalAlert(CommonMessage.default.Login.Failed.Title, "Email haven't registered");
        });
      } else {
        ShowNormalAlert(CommonMessage.default.Login.Failed.Title, "Email haven't registered");
      }
    }).catch((exp) => {
      ShowNormalAlert(CommonMessage.default.Login.Failed.Title, "Email haven't registered");
      console.warn(exp);
    })
  }
  return (
    <View style={styles.container}>
      <Image source={require("../Images/Logo.jpg")} style={styles.ImageStyle} resizeMode={'stretch'} />


      <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.Email} style={styles.EmailInput} onChangeText={(text) => { setUserEmail(text) }} />
      <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.Password} secureTextEntry={true} style={styles.PasswordInput} onChangeText={(text) => { setUserPassword(text) }} />
      <TouchableOpacity style={styles.LoginButton} onPress={Login}>
        <Text style={styles.LoginText}>{CommonMessage.default.Login.ButtonLogin}</Text>
      </TouchableOpacity>
      <View style={styles.ForgotPasswordView}>
        <TouchableOpacity style={styles.Col} onPress={ForgotPassword}>
          <Text style={styles.ForgorPasswordtex}>{CommonMessage.default.Login.ButtonForgetPassword}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Col}>
          <Text style={styles.ForgorPasswordtex} onPress={CreateAccount}>{CommonMessage.default.Login.CreateAccount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEACA'
  },
  ImageStyle: {
    width: 150,
    height: 150,
    marginBottom:20
  },
  EmailInput: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    width: '80%'
  },
  PasswordInput: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    width: '80%',
    margin: 5
  },
  LoginButton: {
    backgroundColor: '#59FFB9',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    textAlign: 'centre',
    alignContent: 'center',
    alignItems: 'center'
  },
  LoginText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600'
  },
  ForgotPasswordView: {
    flexDirection: 'row',
    width: '100%',
    margin: 20
  },
  Col: {
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  ForgorPasswordtex: {
    color: 'blue'
  }
});
export default LoginScreen;