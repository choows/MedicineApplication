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

function ViewMedicine({ route, navigation }) {
    const { medicine, url } = route.params;
    const Medicine = JSON.parse(medicine);
    const [image, setImage] = React.useState(Medicine.ImagePath);
    const Take=()=>{
        console.log(url);
        Medicine.Active = false;
        console.log(Medicine);
        firebase.database().ref(url).set(Medicine).then((r) => {
            ShowNormalAlert("" , "Update Medicine Successfully");
            navigation.goBack();
        });
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%', alignContent: 'center', paddingTop: 40 }}>
                <View style={[styles.RowContainer, { marginBottom: 100, alignSelf: 'center' }]}>
                    <View>
                        <Image
                            style={{ width: 150, height: 150, borderRadius: 100, backgroundColor: 'red' }}
                            source={{
                                uri: image,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Medication Name</Text>
                    <TextInput style={styles.MediNameTextInput} value={Medicine.Name} editable={false} />
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Date</Text>
                    <View style={styles.Touchable}>
                        <TextInput value={Medicine.Date} editable={false} style={styles.InnerTextInput} />
                    </View>

                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Time</Text>
                    <View style={styles.Touchable}>
                        <TextInput value={Medicine.Time} editable={false} style={styles.InnerTextInput} />

                    </View>
                </View>
                <View style={styles.RowContainer}>
                    <Text style={styles.Title}>Notes</Text>
                    <TextInput style={styles.MediNameTextInput} value={Medicine.Notes} editable={false} />
                </View>
                <TouchableOpacity style={styles.ButtonView} onPress={Take}>
                    <Text style={styles.ButtonText}>Take</Text>
                </TouchableOpacity>
                <View style={{ height: 150 }}>
                </View>
            </ScrollView>
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
export default ViewMedicine;