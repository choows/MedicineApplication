import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";


// const authForDefaultApp = firebase.auth();
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
            ShowNormalAlert("Change Password Failed", "Information Required");
            return;
        }
        if (newPassword != confirmNewPassword) {
            ShowNormalAlert("Change Password Failed", "Unmatch Password");
            return;
        }
        const emailCred = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser, oldPassword);
        firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                return firebase.auth().currentUser.updatePassword(newPassword);
                ShowNormalAlert("Change Password", "Successed !");
            })
            .catch(error => {
                // Handle error.
                ShowNormalAlert("Change Password Failed", error);
            });
    }
    return (
        <View style={styles.container}>
            <Icon
                name='person'
                type='ionicons'
                size={80} />
            <TextInput style={styles.TextInputStyle} value={email} onChangeText={setEmail} placeholder={"Email"} />
            <TextInput style={styles.TextInputStyle} value={displayName} onChangeText={setDisplayName} placeholder="displayName" />
            <TouchableOpacity style={styles.ButtonView} onPress={() => { updateProfile() }}>
                <Text>Update Profile</Text>
            </TouchableOpacity>

            <TextInput style={styles.TextInputStyle} value={oldPassword} onChangeText={setOldPassword} placeholder="Old Password" />
            <TextInput style={styles.TextInputStyle} value={newPassword} onChangeText={setnewPassword} placeholder="New Password" />
            <TextInput style={styles.TextInputStyle} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Coinfirm New Password" />

            <TouchableOpacity style={styles.SecondButtonView} onPress={() => { ChangePassword() }}>
                <Text>Change Password</Text>
            </TouchableOpacity>
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
        marginTop: 15
    },
    ButtonView: {
        width: '80%',
        backgroundColor: 'green',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20
    },
    SecondButtonView: {
        width: '80%',
        backgroundColor: 'blue',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20
    }
});


export default Profile;