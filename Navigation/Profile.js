import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";
import * as CommonString from "../CommonFunction/CommonString";
import { ScrollView } from 'react-native-gesture-handler';

function Profile({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [email, setEmail] = React.useState(UserInfo.email)
    const [displayName, setDisplayName] = React.useState(UserInfo.displayName);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setnewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');


    const updateProfile = () => {
        const update = {
            displayName: displayName
        };
        console.log(firebase.auth().currentUser);
        firebase.auth().currentUser.updateProfile(update).then(() => {
            ShowNormalAlert("Profile Update", "Successed!");
        }).catch((exp) => {
            console.log(exp);
        })
    }
    const ChangePassword = () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            ShowNormalAlert(CommonString.default.UpdateProfile.ChangePassword.Failed, CommonString.default.UpdateProfile.ChangePassword.FailedReason.InformationRequired);
            return;
        }
        if (newPassword != confirmNewPassword) {
            ShowNormalAlert(CommonString.default.UpdateProfile.ChangePassword.Failed, CommonString.default.UpdateProfile.ChangePassword.FailedReason.Unmatch);
            return;
        }
        const emailCred = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser, oldPassword);
        firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                return firebase.auth().currentUser.updatePassword(newPassword).then(() => {
                    ShowNormalAlert("", CommonString.default.UpdateProfile.ChangePassword.Success);
                });

            })
            .catch(error => {
                // Handle error.
                ShowNormalAlert(CommonString.default.UpdateProfile.ChangePassword.Failed, error);
            });
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{width:'100%' , height:'100%', alignContent:'center', paddingTop:30}}>
                <Icon
                    name='person'
                    type='ionicons'
                    size={80} />
                <TextInput style={styles.TextInputStyle} value={email} onChangeText={setEmail} placeholder={CommonString.default.Form.PlaceHolder.Email} />
                <TextInput style={styles.TextInputStyle} value={displayName} onChangeText={setDisplayName} placeholder={CommonString.default.Form.PlaceHolder.DisplayName} />
                <TouchableOpacity style={styles.ButtonView} onPress={() => { updateProfile() }}>
                    <Text>{CommonString.default.UpdateProfile.ButtonText.UpdateProfile}</Text>
                </TouchableOpacity>

                <TextInput style={styles.TextInputStyle} value={oldPassword} onChangeText={setOldPassword} placeholder={CommonString.default.Form.PlaceHolder.OldPassword} />
                <TextInput style={styles.TextInputStyle} value={newPassword} onChangeText={setnewPassword} placeholder={CommonString.default.Form.PlaceHolder.NewPassword} />
                <TextInput style={styles.TextInputStyle} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder={CommonString.default.Form.PlaceHolder.ConfirmPassword} />

                <TouchableOpacity style={styles.SecondButtonView} onPress={() => { ChangePassword() }}>
                    <Text>{CommonString.default.UpdateProfile.ButtonText.ChangePassword}</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>);
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    TextInputStyle: {
        width: '80%',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        textAlign: 'center',
        marginTop: 15,
        alignSelf:'center'
    },
    ButtonView: {
        width: '80%',
        backgroundColor: 'green',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20,
        alignSelf:'center'
    },
    SecondButtonView: {
        width: '80%',
        backgroundColor: 'blue',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20,
        alignSelf:'center'
    }
});


export default Profile;