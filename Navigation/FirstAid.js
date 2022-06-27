import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Linking, Image, Touchable } from 'react-native';
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
        firebase.database().ref(path).on('value', (resp) => {
            let data = [];
            for (var i in resp.val()) {
                const d = resp.val()[i];
                data.push({
                    title: d.Title,
                    image_uri: d.image_uri,
                    Details: d.Details
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
            console.log("Here");
            console.log(second_list)
        });



    }, []);
    const OnViewClicked = (url) => {
        console.log("empty here ");
        let all_param = [];
        for(var i in url){
            if(url[i]){
                all_param.push(url[i]);
            }
        }
        navigation.navigate('FirstAidDetail', {
            user: user,
            details: JSON.stringify(all_param)
        })

    }
    return (
        <View style={styles.main_container}>
            <ScrollView style={styles.container}>
                {
                    image.map(x =>
                        <View style={styles.RowView}>
                            {
                                x.map(y =>
                                    <TouchableOpacity style={styles.Itemview} onPress={()=>{OnViewClicked(y.Details)}}>
                                        <Image source={{uri : y.image_uri}} style={{height:100, width:100}}/>
                                    </TouchableOpacity>
                                    )
                            }
                        </View>)
                }
                <View>
                </View>
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