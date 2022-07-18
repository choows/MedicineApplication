import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import auth, { firebase} from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import CommonString, * as CommonMessage from "../CommonFunction/CommonString";
import AsyncStorage from '@react-native-async-storage/async-storage';

function ForgotPassword({ navigation }) {
    const [UserEmail, setUserEmail] = React.useState('');
    const [ConfirmEmail, setConfirmEmail] = React.useState('');

    const Reset = () => {
        if (!UserEmail) {
            ShowNormalAlert("Reset Password Failed", CommonMessage.default.Login.EmailRequired);
            return;
        }
        if (!ConfirmEmail) {
            ShowNormalAlert("Reset Password Failed", "Confirm Email Required");
            return;
        }
        if (UserEmail != ConfirmEmail) {
            ShowNormalAlert("Reset Password Failed", "Unmatch Email");
            return;
        }
        
        auth().sendPasswordResetEmail(UserEmail).then((resp) => {
            ShowNormalAlert("Reset Password Link Sended To Registered Email");
           // navigation.back();
        }).catch((exp)=>{
            ShowNormalAlert("Reset Password Failed");
        });
    }
    
    return (
        <View style={styles.container}>
            <TextInput placeholder={CommonMessage.default.Form.PlaceHolder.Email} style={styles.EmailInput} onChangeText={(text) => { setUserEmail(text) }} />
            <TextInput placeholder={"Confirm Email"} style={styles.EmailInput} onChangeText={(text) => { setConfirmEmail(text) }} />
            <TouchableOpacity style={styles.LoginButton} onPress={Reset}>
                <Text style={styles.LoginText}>Reset Password</Text>
            </TouchableOpacity>
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
    EmailInput: {
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        width: '80%',
        marginTop:15
    },
    PasswordInput: {
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        width: '80%',
        margin: 5,
        marginTop:15
    },
    LoginButton: {
        backgroundColor: '#59FFB9',
        borderRadius: 10,
        padding: 15,
        width: '80%',
        textAlign: 'centre',
        alignContent: 'center',
        alignItems: 'center',
        marginTop:15
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
export default ForgotPassword;