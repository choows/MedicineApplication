import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity  , Alert} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import {ShowNormalAlert} from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
// const authForDefaultApp = firebase.auth();
function CreateAccount({navigation}) {
    const [UserEmail, setUserEmail] = React.useState('');
    const [UserPassword, setUserPassword] = React.useState('');
    const [UserConfirmPassword , setUserConfirmPassword] = React.useState('');

    const Register = () => {
        const messsage = CommonMessage.default.Registration;
        if(!UserEmail){
            ShowNormalAlert(messsage.Failed.Title, messsage.Failed.EmailRequired);
            return;
        }
        if(!UserPassword){
            ShowNormalAlert(messsage.Failed.Title, messsage.Failed.PasswordRequired);
            return;
        }
        if(UserPassword.length < 6){
            ShowNormalAlert(messsage.Failed.Title, messsage.Failed.PasswordMin);
            return;
        }
        if(!UserConfirmPassword){
            ShowNormalAlert(messsage.Failed.Title, messsage.Failed.ConfirmPasswordRequired);
            return;
        }
        if(UserPassword != UserConfirmPassword){
            ShowNormalAlert(messsage.Failed.Title, messsage.Failed.UnmatchPassword);
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(UserEmail , UserPassword).then((resp)=>{
            ShowNormalAlert(messsage.Success.Title);
            navigation.back();
        }).catch((exp)=>{
            console.warn(exp)
        });
    }
    return (
        <View style={styles.container}>
            <Text style={styles.Title}>
                Register New User
            </Text>
            <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.Email} style={styles.EmailInput} onChangeText={(text) => { setUserEmail(text) }} />
            <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.Password} secureTextEntry={true} style={styles.PasswordInput} onChangeText={(text) => { setUserPassword(text) }} />
            <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.ConfirmPassword} secureTextEntry={true} style={styles.PasswordInput} onChangeText={(text) => { setUserConfirmPassword(text) }} />
            <TouchableOpacity style={styles.LoginButton} onPress={Register}>
                <Text style={styles.LoginText}>Register Now</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEACA'
    },
    Title: {
        fontSize: 30,
        color: 'black',
        margin:20
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
export default CreateAccount;