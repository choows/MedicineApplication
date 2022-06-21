import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";

function FirstAid({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [image, setimage] = React.useState([]);

    React.useEffect(() => {
        //https://oblador.github.io/react-native-vector-icons/
        const path = "/firstaid";
        firebase.database().ref(path).once('value').then((resp) => {
            let data = [];
            for (var i in resp.val()) {
                const d = resp.val()[i];
                data.push({
                    url: d.url,
                    iconfamily: d.iconfamily,
                    iconname: d.iconname,
                    name: d.name
                });
            }

            var second_list = [];
            for (var idx = 0; idx < data.length; idx = idx + 2) {
                var list = [];
                list.push(data[idx]);
                if ((idx + 1) < data.length) {
                    list.push(data[idx + 1]);
                }
                if ((idx + 2) < data.length) {
                    list.push(data[idx + 2]);
                }
                second_list.push(list);
            }
            setimage(second_list);
        }).catch((exp) => {
            console.warn(exp);
        })



    }, []);
    const OnViewClicked = (url) => {
        console.log(url);
        Linking.openURL(url);
    }
    return (
        <View style={styles.main_container}>
            <ScrollView style={styles.container}>
                {
                    image.map(x =>
                        <View style={styles.RowView}>
                            {
                                x.map(y =>
                                    <TouchableOpacity style={styles.Itemview} onPress={() => { OnViewClicked(y.url) }}>
                                        <Icon
                                            name={y.iconname}
                                            type={y.iconfamily}
                                            size={100} />
                                        <Text style={styles.TextStyle}>{y.name}</Text>
                                    </TouchableOpacity>
                                )
                            }

                        </View>
                    )
                }

            </ScrollView>
            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>);
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        height: '90%',
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    main_container: {
        alignContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    RowView: {
        padding: 15,
        flexDirection: 'row',
        width: '100%'
    },
    TextStyle: {
        fontWeight: 'bold'
    },
    Itemview: {
        padding: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '33.33%'
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
export default FirstAid;