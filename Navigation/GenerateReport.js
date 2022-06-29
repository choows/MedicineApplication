import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, Platform, ScrollView } from 'react-native';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import { Icon } from "@rneui/themed";
import { firebase } from '@react-native-firebase/database';
import BottomNavigationBar from "../Component/BottomNavigationBar";
import DateTimePicker from '@react-native-community/datetimepicker';

function GenerateReport({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [fromdate, setFromDate] = React.useState(new Date());
    const [todate, setToDate] = React.useState(new Date());
    const [ReportDate, setReportDate] = React.useState([]);
    const [isDisplayFromDate, setFromShow] = React.useState(false);
    const [isDisplaytoDate, setToShow] = React.useState(false);
    const ChangeFromDate = (event, selectedDate) => {
        const currentDate = selectedDate || mydate;
        setFromDate(currentDate);
        setFromShow(false)
    };

    const changeToDate = (event, selectedDate) => {
        const currentDate = selectedDate || mydate;
        setToDate(currentDate);
        setToShow(false)
    };
    const RetreiveReport = () => {
        const DayArray = [];
        todate.setHours(23);
        todate.setMinutes(59);
        todate.setSeconds(59);
        if (fromdate.getTime() > todate.getTime()) {
            ShowNormalAlert(CommonMessage.default.GenerateReport.Failed, CommonMessage.default.GenerateReport.FailedReason.InvalidDateRange);
            return;
        }
        let selected_start_date = new Date();
        selected_start_date.setDate(fromdate.getDate());
        selected_start_date.setMonth(fromdate.getMonth());
        selected_start_date.setFullYear(fromdate.getFullYear());
        while (selected_start_date.getTime() <= todate.getTime()) {
            console.log("Marked", selected_start_date.toDateString());
            DayArray.push(selected_start_date.toDateString());
            selected_start_date.setDate(selected_start_date.getDate() + 1);
        }

        const path = "/user/" + UserInfo.uid;
        firebase.database().ref(path).once('value').then((resp) => {
            let this_date = [];

            for (var i in resp.val()) {
                const d = resp.val()[i];
                if (DayArray.includes(d.Date)) {
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
            setReportDate(this_date);
        }).catch((exp) => {
            console.warn(exp);
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollViewStyle}>
                <View style={styles.DatetimePickerView}>
                    <TouchableOpacity onPress={() => { setFromShow(true) }} style={styles.DatePickerItem}>
                        <TextInput value={fromdate.toDateString()} editable={false} />
                        {isDisplayFromDate && (
                            <DateTimePicker
                                value={fromdate}
                                mode={"date"}
                                display="calendar"
                                onChange={(event, selectedDate) => { ChangeFromDate(event, selectedDate) }}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setToShow(true) }} style={styles.DatePickerItem}>
                        <TextInput value={todate.toDateString()} editable={false} />
                        {isDisplaytoDate && (
                            <DateTimePicker
                                value={todate}
                                mode={"date"}
                                display="calendar"
                                onChange={(event, selectedDate) => { changeToDate(event, selectedDate) }}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={[styles.DatetimePickerView, { alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity style={styles.GenerateReportTouchable} onPress={() => { RetreiveReport() }}>
                        <Text style={{ color: 'white' }}>{CommonMessage.default.GenerateReport.Title}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.DatetimePickerView, {flexDirection:'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]}>
                    {
                        ReportDate.length> 0 && (
                            <>
                                <View style={styles.TableRow}>
                                    <View style={[styles.TablerowItem, { width: '25%' }]}>
                                        <Text style={{fontWeight:'900'}}>{CommonMessage.default.GenerateReport.Field.Date}</Text>
                                    </View>
                                    <View style={[styles.TablerowItem, { width: '25%' }]}>
                                        <Text style={{fontWeight:'bold'}}>{CommonMessage.default.GenerateReport.Field.Time}</Text>
                                    </View>
                                    <View style={[styles.TablerowItem, { width: '25%' }]}>
                                        <Text style={{fontWeight:'bold'}}>{CommonMessage.default.GenerateReport.Field.MedicineName}</Text>
                                    </View>
                                    <View style={[styles.TablerowItem, { width: '25%' }]}>
                                        <Text style={{fontWeight:'bold'}}>{CommonMessage.default.GenerateReport.Field.Note}</Text>
                                    </View>
                                </View>
                                {
                                    ReportDate.map((x) =>
                                        <View style={styles.TableRow} key={JSON.stringify(x)}>
                                            <View style={[styles.TablerowItem, { width: '25%' }]}>
                                                <Text>{x.Date}</Text>
                                            </View>
                                            <View style={[styles.TablerowItem, { width: '25%' }]}>
                                                <Text>{x.Time}</Text>
                                            </View>
                                            <View style={[styles.TablerowItem, { width: '25%' }]}>
                                                <Text>{x.Name}</Text>
                                            </View>
                                            <View style={[styles.TablerowItem, { width: '25%' }]}>
                                                <Text>{x.Notes}</Text>
                                            </View>
                                        </View>
                                    )
                                }

                            </>
                        )

                    }
                </View>
                <View style={{height:150}}>

        </View>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    GenerateReportTouchable: {
        backgroundColor: 'green',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1
    },
    scrollViewStyle: {
        width: '100%',
        height: '90%'
    },
    DatetimePickerView: {
        padding: 10,
        flexDirection: 'row',
        width: '100%'
    },
    DatePickerItem: {
        width: '50%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TableRow: {
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'black',
        borderWidth:1,
        backgroundColor:'white'
    },
    TablerowItem: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding:10
    }
});
export default GenerateReport;