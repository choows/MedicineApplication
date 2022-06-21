import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import { Icon } from "@rneui/themed";
import { firebase } from '@react-native-firebase/database';

// const authForDefaultApp = firebase.auth();
function EmergencyContact({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)

    const [Name, setName] = React.useState('');
    const [Relation, setRelation] = React.useState('');
    const [PhoneNumber, setPhoneNumber] = React.useState('');
    const [Address, setAddress] = React.useState('');
    const [Existed, setExisted] = React.useState(false);
    const Call = () => {
        Linking.openURL(`tel:${PhoneNumber}`)
    }
    const ShowOnMap = (lat , lng) => {
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
            if(resp_json["data"] != []){
                console.log("Found");
                console.log(resp_json["data"][0].latitude);
                console.log(resp_json["data"][0].longitude);
                ShowOnMap(resp_json["data"][0].latitude , resp_json["data"][0].longitude);
               // console.log(resp.data.latitude);
               // console.log(resp.data.longitude);
            }else{
                ShowNormalAlert("Show On Map Failed", "Location Not found");
              //  console.log(resp.data);
            }
        }).catch((exp) => {
            console.warn(exp);
        })
    }
    const UpdateEmergencyContact = () => {

        if (!Name) {
            ShowNormalAlert("Emergency Contact Update Failed", "Name Required");
            return;
        }
        if (!Relation) {
            ShowNormalAlert("Emergency Contact Update Failed", "Relation Required");
            return;
        }
        if (!PhoneNumber) {
            ShowNormalAlert("Emergency Contact Update Failed", "Phone Number Required");
            return;
        }
        if (!Address) {
            ShowNormalAlert("Emergency Contact Update Failed", "Address Required");
        }
        const path = "EmergencyContact/" + UserInfo.uid;
        const JsonFormat = {
            Name: Name,
            Relation: Relation,
            PhoneNumber: PhoneNumber,
            Address: Address
        };
        if (Existed) {
            firebase.database()
                .ref(path)
                .update(JsonFormat)
                .then(() => { ShowNormalAlert("Emergency Contact", "Updated"); GetData(); });
        } else {
            firebase.database().ref(path).set(JsonFormat).then((resp) => {
                ShowNormalAlert("Emergency Contact", "Updated");
                GetData();
            }).catch((exp) => {
                ShowNormalAlert("Update Emergency Info failed", exp);
            })
        }

    }
    const GetData = () => {
        const path = "EmergencyContact/" + UserInfo.uid;
        firebase.database().ref(path).on('value', (resp) => {
            if (resp.val()) {
                setName(resp.val().Name);
                setRelation(resp.val().Relation);
                setPhoneNumber(resp.val().PhoneNumber);
                setAddress(resp.val().Address);
            }
        });
    }
    React.useEffect(() => {
        GetData();
    }, []);
    return (<View style={styles.container}>
        <Icon
            name='person'
            type='ionicons'
            size={80} />
        <TextInput style={styles.TextInputStyle} value={Name} onChangeText={setName} placeholder={"Name"} />
        <TextInput style={styles.TextInputStyle} value={Relation} onChangeText={setRelation} placeholder={"Relationship"} />
        <TextInput style={styles.TextInputStyle} value={PhoneNumber} onChangeText={setPhoneNumber} placeholder={"Phone Number"} />
        <TextInput style={styles.TextInputStyle} value={Address} onChangeText={setAddress} placeholder={"Address"} />
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