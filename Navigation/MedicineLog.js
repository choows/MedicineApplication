import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Touchable, ScrollView } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";



function MedicineLog({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [data, setdata] = React.useState([]);
    const [date, setDate] = React.useState(new Date());
    const [, updateState] = React.useState();

    const forceUpdate = React.useCallback(() => updateState({}), []);
    const MonthtoWord = (month) => {
        if (month == 0) {
            return "January";
        }
        if (month == 1) {
            return "February";
        }
        if (month == 2) {
            return "March";
        }
        if (month == 3) {
            return "April";
        }
        if (month == 4) {
            return "May";
        }
        if (month == 5) {
            return "Jun";
        }
        if (month == 6) {
            return "July";
        }
        if (month == 7) {
            return "August";
        }
        if (month == 8) {
            return "September";
        }
        if (month == 9) {
            return "October";
        }
        if (month == 10) {
            return "November";
        }
        if (month == 11) {
            return "December";
        }
    }
    const changeDate = (day) => {
        date.setDate(date.getDate() + day);
        setDate(date);

        const path = "/user/" + UserInfo.uid;
        firebase.database().ref(path).once('value').then((resp) => {
            // console.log(resp.val());
            let this_date = [];

            for (var i in resp.val()) {
                const d = resp.val()[i];
                if (d.Date == date.toDateString()) {
                    this_date.push({
                        Active: d.Active,
                        Date: d.Date,
                        Name: d.Name,
                        Notes: d.Notes,
                        Time: d.Time,
                        Key: i
                    });
                }
            }
            this_date.sort(function (a, b) {
                let date_detail = new Date(a.Date);
                let Timestr_detail = a.Time.split(":");
                let Timestr_detail_2 = b.Time.split(":");

                date_detail.setHours(Timestr_detail[0]);
                date_detail.setMinutes(Timestr_detail[1]);
                date_detail.setSeconds(Timestr_detail[2]);

                let date_detail2 = new Date(b.Date);
                date_detail2.setHours(Timestr_detail_2[0]);
                date_detail2.setMinutes(Timestr_detail_2[1]);
                date_detail2.setSeconds(Timestr_detail_2[2]);

                return date_detail - date_detail2;
            });
            setdata(this_date);
        }).catch((exp) => {
            console.warn(exp);
        })
        forceUpdate();
    }
    React.useEffect(() => {
        changeDate(0);
    }, []);
    React.useEffect(() => {
        console.log(date.toString())
    }, date);
    return (
        <View style={styles.container}>
            <View style={styles.NavigationView}>
                <TouchableOpacity style={styles.ArrowView} onPress={() => { changeDate(-1) }}>
                    <Icon
                        name='arrow-left'
                        type='fontisto' />
                </TouchableOpacity>
                <View style={styles.DateView}>
                    <Text style={styles.DateTitle}>{date.getDate().toString()}</Text>
                    <Text style={styles.DateSubtitle}>{MonthtoWord(date.getMonth()) + " " + date.getFullYear().toString()}</Text>
                </View>
                <TouchableOpacity style={styles.ArrowView} onPress={() => { changeDate(1) }}>
                    <Icon
                        name='arrow-right'
                        type='fontisto' />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.LogView}>
                {
                    data.length > 0 ? data.map(x =>
                        <View key={x.Key} style={styles.DetailView}>
                            <View style={styles.Subview}>
                                <Text style={styles.TimeView}>{x.Time}</Text>
                                <Text>{x.Date}</Text>
                            </View>
                            <View style={styles.RightSubView}>
                                <Text style={styles.NormalText}>{x.Name}</Text>
                                <Text style={styles.NormalText}>{x.Notes}</Text>
                            </View>
                        </View>
                    ) :
                        <Text>{CommonMessage.default.MediLog.NoRecord}</Text>
                }
                <View style={{ height: 1000 }}>

                </View>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    TimeView: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    NormalText: {
        fontWeight: '600',
        margin: 5
    },
    RightSubView: {
        width: '50%',
        height: '100%',
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: 'black'
    },
    Subview: {
        width: '50%',
        height: '100%',
        padding: 10
    },
    DetailView: {
        width: '100%',
        padding: 5,
        minHeight: '20%',
        flexDirection: 'row'
    },
    NavigationView: {
        height: '25%',
        width: '100%',
        padding: 20,
        flexDirection: 'row'
    },
    DateTitle: {
        fontSize: 25,
        fontWeight: '900'
    },
    DateSubtitle: {
        fontSize: 23,
        fontWeight: '500',
        marginTop: '2%'
    },
    ArrowView: {
        width: '30%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    DateView: {
        width: '40%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    LogView: {
        width: '100%',
        padding: 10
    }
})
export default MedicineLog;