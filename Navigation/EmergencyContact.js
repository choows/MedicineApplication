import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, Platform, PermissionsAndroid, Image } from 'react-native';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import { Icon } from "@rneui/themed";
import { firebase } from '@react-native-firebase/database';
import * as ImagePicker from 'react-native-image-picker';

function EmergencyContact({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)

    const [Name, setName] = React.useState('');
    const [Relation, setRelation] = React.useState('');
    const [PhoneNumber, setPhoneNumber] = React.useState('');
    const [Address, setAddress] = React.useState('');
    const [Existed, setExisted] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const Call = () => {
        Linking.openURL(`tel:${PhoneNumber}`)
    }
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

    const ShowOnMap = (lat, lng) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = Name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    }
    const OpenMap = (address) => {
        fetch('http://api.positionstack.com/v1/forward?access_key=32485e2612ff40029c6052547edcabc8&query=' + address).then((resp) => {
            return resp.text();

        }).then((resp) => {
            var resp_json = JSON.parse(resp);
            if (resp_json["data"] != []) {
                console.log("Found");
                console.log(resp_json["data"][0].latitude);
                console.log(resp_json["data"][0].longitude);
                ShowOnMap(resp_json["data"][0].latitude, resp_json["data"][0].longitude);
                // console.log(resp.data.latitude);
                // console.log(resp.data.longitude);
            } else {
                ShowNormalAlert("Show On Map Failed", "Location Not found");
                //  console.log(resp.data);
            }
        }).catch((exp) => {
            console.warn(exp);
        })
    }
    const UpdateEmergencyContact = () => {

        if (!Name) {
            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, CommonMessage.default.EmergencyContact.FailReason.NameRequired);
            return;
        }
        if (!Relation) {
            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, CommonMessage.default.EmergencyContact.FailReason.RelationRequired);
            return;
        }
        if (!PhoneNumber) {
            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, CommonMessage.default.EmergencyContact.FailReason.PhoneRequired);
            return;
        }
        if (!Address) {
            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, CommonMessage.default.EmergencyContact.FailReason.AddressRequired);
            return;
        }
        if (!image) {
            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, "Image Required");
            return;
        }
        uploadImage(image);

    }
    const GetData = () => {
        const path = "EmergencyContact/" + UserInfo.uid;
        firebase.database().ref(path).on('value', (resp) => {
            if (resp.val()) {
                setName(resp.val().Name);
                setRelation(resp.val().Relation);
                setPhoneNumber(resp.val().PhoneNumber);
                setAddress(resp.val().Address);
                setImage(resp.val().Image_URI)
                setExisted(true);
            }
        });
    }
    const uploadImage = async (image_uri) => {
        const uri = image_uri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const path = "EmergencyContact/" + UserInfo.uid;
        if (Existed) {
            const JsonFormat = {
                Name: Name,
                Relation: Relation,
                PhoneNumber: PhoneNumber,
                Address: Address,
                Image_URI: image_uri
            };
            firebase.database()
                .ref(path)
                .update(JsonFormat)
                .then(() => {
                    ShowNormalAlert(CommonMessage.default.EmergencyContact.Title, CommonMessage.default.EmergencyContact.UpdateSuccess);
                    GetData();
                });
        } else {
            setUploading(true);
            firebase.storage()
                .ref(filename)
                .putFile(uploadUri).then((resp) => {
                    firebase.storage().ref(resp.metadata.fullPath).getDownloadURL().then((res) => {
                        const JsonFormat = {
                            Name: Name,
                            Relation: Relation,
                            PhoneNumber: PhoneNumber,
                            Address: Address,
                            Image_URI: res
                        };
                        firebase.database().ref(path).set(JsonFormat).then((resp) => {
                            ShowNormalAlert(CommonMessage.default.EmergencyContact.Title, CommonMessage.default.EmergencyContact.UpdateSuccess);
                            GetData();
                        }).catch((exp) => {
                            ShowNormalAlert(CommonMessage.default.EmergencyContact.UpdateFailed, exp);
                        });
                    }).catch((exp) => {
                        ShowNormalAlert("Unable To Update Emergency Contact", exp);
                    });
                });
        }

    };
    React.useEffect(() => {
        GetData();
    }, []);
    return (<View style={styles.container}>

        <TouchableOpacity onPress={() => { selectImage() }} style={{ alignSelf: 'center' }}>
            {image ?
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
        <TextInput style={styles.TextInputStyle} value={Name} onChangeText={setName} placeholder={CommonMessage.default.Form.PlaceHolder.Name} />
        <TextInput style={styles.TextInputStyle} value={Relation} onChangeText={setRelation} placeholder={CommonMessage.default.Form.PlaceHolder.Relationship} />
        <TextInput style={styles.TextInputStyle} value={PhoneNumber} onChangeText={setPhoneNumber} placeholder={CommonMessage.default.Form.PlaceHolder.PhoneNumber} />
        <TextInput style={styles.TextInputStyle} value={Address} onChangeText={setAddress} placeholder={CommonMessage.default.Form.PlaceHolder.Address} />
        <View style={{ width: '80%', flexDirection: 'row' }}>

            <TouchableOpacity style={styles.ButtonView} onPress={() => { Call() }}>
                <Icon
                    name='phone'
                    type='feather'
                    size={40} />
                <Text>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ButtonView} onPress={() => { UpdateEmergencyContact() }}>
                <Icon
                    name='update'
                    type='materialicons'
                    size={40} />
                <Text>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ButtonView} onPress={() => { OpenMap(Address) }}>
                <Icon
                    name='map'
                    type='entypo'
                    size={40} />
                <Text>Map</Text>
            </TouchableOpacity>
        </View>

    </View>
    );
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
        width: '33.33%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 20
    }
});


export default EmergencyContact;