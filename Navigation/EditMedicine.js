import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, PermissionsAndroid } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import { } from "@react-native-firebase/storage"
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNavigationBar from "../Component/BottomNavigationBar";
import * as ImagePicker from 'react-native-image-picker';
import PushNotification from "react-native-push-notification";
import { ScrollView } from 'react-native-gesture-handler';


// import{firebase} from "@react-native-firebase/storage";
function EditMedicine({ route, navigation }) {
    const { user, medicine } = route.params;
    const UserInfo = JSON.parse(user);
    const Medicine = JSON.parse(medicine);
    const [MedicineName, setMedicineName] = React.useState(Medicine.Name);
    const [Notes, setNotes] = React.useState(Medicine.Notes);
    const [mydate, setDate] = React.useState(new Date());
    const [isDisplayDate, setShow] = React.useState(false);
    const [myTime, setTime] = React.useState(new Date());
    const [isDisplayTime, setTimeShow] = React.useState(false);
    const [image, setImage] = React.useState(Medicine.ImagePath);
    const [uploading, setUploading] = React.useState(false);
    const [ChangedImage, setchangedImage] = React.useState(false);
    const changeSelectedTime = (event, selectedDate) => {
        const currentDate = selectedDate || mydate;
        setTime(currentDate);
        setTimeShow(false)

    };
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
                setchangedImage(true);
            }
        });
    };


    const changeSelectedDate = (event, selectedDate) => {
        const currentDate = selectedDate || mydate;
        setDate(currentDate);
        setShow(false)
    };

    const AddNewReminder = () => {
        if (!MedicineName) {
            ShowNormalAlert("Unable To Add New Reminder", "Medicine Name Required");
            return;
        }
        if (!image) {
            ShowNormalAlert("Unable To Add New Reminder", "Image Required");
            return;
        }
        uploadImage(image).then((resp) => {
            console.log("Uploaded");
        }).then((resp) => {
            console.log(resp);
        });
    }
    const SetNotification = (date, path) => {
        PushNotification.localNotificationSchedule({
            channelId: "RN-Channel",
            //... You can use all the options from localNotifications
            message: "Time To Take Medicine", // (required)
            bigText: "Hi, It is Time to take medicine " + MedicineName, // (optional) default: "message" prop
            subText: path,
            date: date, // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            actions:["Dismiss" , "Snooze", "Take"],
            invokeApp:false,
            /* Android Only Properties */
            repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
        });
    }
    const uploadImage = async (image_uri) => {
        const uri = image_uri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        if (ChangedImage) {
            firebase.storage()
                .ref(filename)
                .putFile(uploadUri).then((resp) => {
                    firebase.storage().ref(resp.metadata.fullPath).getDownloadURL().then((res) => {
                        const path = "/user/" + UserInfo.uid + "/" + Medicine.Key;
                        const JsonFormat = {
                            Date: mydate.toDateString(),
                            Time: myTime.toLocaleTimeString(),
                            Name: MedicineName,
                            Notes: Notes,
                            Active: true,
                            ImagePath: res
                        };
                        firebase.database().ref(path).set(JsonFormat).then((resp) => {
                            ShowNormalAlert("Updated", "Successfully");
                        }).then(() => {
                            mydate.setHours(myTime.getHours());
                            mydate.setMinutes(myTime.getMinutes());
                            mydate.setSeconds(myTime.getSeconds());
                            SetNotification(mydate , path);
                        }).then(() => {
                             navigation.goBack();
                        }).catch((exp) => {
                            ShowNormalAlert("Unable To Add New Reminder", exp);
                        })
                    });

                });
        } else {
            const path = "/user/" + UserInfo.uid + "/" + Medicine.Key;
            const JsonFormat = {
                Date: mydate.toDateString(),
                Time: myTime.toLocaleTimeString(),
                Name: MedicineName,
                Notes: Notes,
                Active: true,
                ImagePath: image
            };
            firebase.database().ref(path).set(JsonFormat).then((resp) => {
                ShowNormalAlert("Updated", "Successfully");
            }).then(() => {
                mydate.setHours(myTime.getHours());
                mydate.setMinutes(myTime.getMinutes());
                mydate.setSeconds(myTime.getSeconds());
                SetNotification(mydate , path);
            }).then(() => {
                 navigation.goBack();
            }).catch((exp) => {
                ShowNormalAlert("Unable To Add New Reminder", exp);
            });
        }


    };
    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%', alignContent: 'center', paddingTop: 40 }}>
                <View style={[styles.RowContainer, { marginBottom: 100, alignSelf: 'center' }]}>
                    <TouchableOpacity onPress={() => { selectImage() }}>
                        <Image
                            style={{ width: 150, height: 150, borderRadius: 100, backgroundColor: 'white' }}
                            source={{
                                uri: image,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Medication Name</Text>
                    <TextInput onChangeText={setMedicineName} style={styles.MediNameTextInput} value={MedicineName} />
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Date</Text>
                    <TouchableOpacity onPress={() => { setShow(true) }} style={styles.Touchable}>
                        <TextInput value={mydate.toDateString()} editable={false} style={styles.InnerTextInput} />
                        {isDisplayDate && (
                            <DateTimePicker
                                value={mydate}
                                mode={"date"}
                                is24Hour={true}
                                display="calendar"
                                onChange={(event, selectedDate) => { changeSelectedDate(event, selectedDate) }}
                            />
                        )}
                    </TouchableOpacity>

                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Time</Text>
                    <TouchableOpacity onPress={() => { setTimeShow(true) }} style={styles.Touchable}>
                        <TextInput value={myTime.toLocaleTimeString()} editable={false} style={styles.InnerTextInput} />
                        {isDisplayTime && (
                            <DateTimePicker
                                value={myTime}
                                mode={"time"}
                                is24Hour={true}
                                display="clock"
                                onChange={(event, selectedDate) => { changeSelectedTime(event, selectedDate) }}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Notes</Text>
                    <TextInput onChangeText={setNotes} style={styles.MediNameTextInput} value={Notes} />
                </View>
                <TouchableOpacity style={styles.ButtonView} onPress={() => { AddNewReminder() }}>
                    <Text style={styles.ButtonText}>Update</Text>
                </TouchableOpacity>
                <View style={{height:150}}>

        </View>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>
    )
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
    ButtonView: {
        marginVertical: '5%',
        width: '50%',
        backgroundColor: '#a3fa2c',
        padding: 10,
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    ButtonText: {
        fontWeight: 'bold'
    },
    RowContainer: {
        width: '100%',
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        paddingHorizontal: 20,
        alignSelf: 'center'
    },
    InnerTextInput: {
        height: '100%',
        borderColor: 'blue',
        borderWidth: 1,
        paddingHorizontal: 10
    },
    Touchable: {
        width: '60%',
        height: 40
    },
    MediNameTextInput: {
        width: '60%',
        borderColor: 'blue',
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 10
    },
    Title: {
        width: '40%',
        textAlignVertical: 'center',
        color: 'black',
        fontWeight: '500',
        textAlign: 'right',
        padding: 10
    }
});
export default EditMedicine;