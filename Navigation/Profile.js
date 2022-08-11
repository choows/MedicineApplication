import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, PermissionsAndroid } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";
import * as CommonString from "../CommonFunction/CommonString";
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';

function Profile({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [email, setEmail] = React.useState(UserInfo.email)
    const [displayName, setDisplayName] = React.useState(UserInfo.displayName);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setnewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    React.useEffect(() => {
        RequestPermission();
    }, []);
    const RequestPermission = () => {
        try {
            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message:
                        "Medical2R needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //selectFile();
            }
        } catch (err) {
            console.warn(err);
        }
    }
    const selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.assets.pop()?.uri };
                setImage(source.uri);
                // uploadImage(source.uri);
            }
        });
    };

    const uploadImage = async (image_uri) => {
        const uri = image_uri;
        console.log("image uri : " + image_uri);
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        firebase.storage()
            .ref(filename)
            .putFile(uploadUri).then((resp) => {
                firebase.storage().ref(resp.metadata.fullPath).getDownloadURL().then((res) => {
                    console.log(res);
                    let update = {
                        displayName: displayName,
                        photoURL : res
                    };

                    firebase.auth().currentUser.updateProfile(update).then(() => {
                        ShowNormalAlert("Profile Update", "Successed!");
                    }).catch((exp) => {
                        console.log(exp);
                    })
                }).catch((exp) => {
                    ShowNormalAlert("Unable To Update Profile", exp);
                });
            });
        return result;


    };
    const updateProfile = () => {
        if (image) {
            uploadImage(image);
            return;
        }
        let update = {
            displayName: displayName
        };
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
        const emailCred = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, oldPassword);

        firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then((x) => {
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
            <ScrollView style={{ width: '100%', height: '100%', alignContent: 'center', paddingTop: 30 }}>
                <TouchableOpacity onPress={() => { selectImage() }} style={{ alignSelf: 'center' }}>
                    {UserInfo.photoURL || image ?
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: 'white' }}
                            source={{
                                uri: image ? image : UserInfo.photoURL,
                            }}
                        />
                        :

                        <Icon
                            name='person'
                            type='ionicons'
                            size={80} />
                    }

                </TouchableOpacity>

                <TextInput style={styles.TextInputStyle} value={email} onChangeText={setEmail} placeholder={CommonString.default.Form.PlaceHolder.Email} />
                <TextInput style={styles.TextInputStyle} value={displayName} onChangeText={setDisplayName} placeholder={CommonString.default.Form.PlaceHolder.DisplayName} />
                <TouchableOpacity style={styles.ButtonView} onPress={() => { updateProfile() }}>
                    <Text>{CommonString.default.UpdateProfile.ButtonText.UpdateProfile}</Text>
                </TouchableOpacity>

                <TextInput style={styles.TextInputStyle} value={oldPassword} secureTextEntry={true} onChangeText={setOldPassword} placeholder={CommonString.default.Form.PlaceHolder.OldPassword} />
                <TextInput style={styles.TextInputStyle} value={newPassword} secureTextEntry={true} onChangeText={setnewPassword} placeholder={CommonString.default.Form.PlaceHolder.NewPassword} />
                <TextInput style={styles.TextInputStyle} value={confirmNewPassword} secureTextEntry={true} onChangeText={setConfirmNewPassword} placeholder={CommonString.default.Form.PlaceHolder.ConfirmPassword} />

                <TouchableOpacity style={styles.SecondButtonView} onPress={() => { ChangePassword() }}>
                    <Text>{CommonString.default.UpdateProfile.ButtonText.ChangePassword}</Text>
                </TouchableOpacity>
                <View style={{ height: 150 }}>

                </View>
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
        alignSelf: 'center'
    },
    ButtonView: {
        width: '80%',
        backgroundColor: '#82e0aa',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20,
        alignSelf: 'center'
    },
    SecondButtonView: {
        width: '80%',
        backgroundColor: '#5dade2',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20,
        alignSelf: 'center'
    }
});


export default Profile;