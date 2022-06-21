import * as React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Modal, Pressable, Touchable, ScrollView } from 'react-native';
import { Icon } from "@rneui/themed";
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { firebase } from '@react-native-firebase/database';
import PieChart from 'react-native-pie-chart';
import PushNotification from "react-native-push-notification";

function HomeScreen({ route, navigation }) {
    const { user } = route.params;
    const UserInfo = JSON.parse(user)
    const [NowCount, setNowCount] = React.useState(0);
    const [UpComingCount, setUpComingcount] = React.useState(0);
    const [MissedCount, setMissedCount] = React.useState(0);
    const [TakenCount, setTakenCount] = React.useState(0);
    const [AllForToday, setAllFortoday] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalDetail, setModalDetail] = React.useState({});
    const [PieData, setPieData] = React.useState([0, 0, 0, 0]);
    const [ShowPie, setShowPie] = React.useState(false);
    const ShowModal = (type) => {

        let Now_temp = [];
        let Upcoming_temp = [];
        let Missed_temp = [];
        let Taken_temp = [];
        const date = new Date();
        for (var i in AllForToday) {
            if (AllForToday[i].Time > date.toLocaleTimeString()) {

                if (AllForToday[i].Active) {
                    Upcoming_temp.push(AllForToday[i]);
                } else {
                    Taken_temp.push(AllForToday[i]);
                }
            } else if (AllForToday[i].Time == date.toLocaleTimeString()) {
                if (AllForToday[i].Active) {
                    Now_temp.push(AllForToday[i]);
                }
            } else {
                if (AllForToday[i].Active) {
                    Missed_temp.push(AllForToday[i]);
                } else {
                    Taken_temp.push(AllForToday[i]);
                }
            }
        }
        if (type == "Now") {
            setModalDetail({
                type: type,
                data: Now_temp
            });
        }
        if (type == "Upcoming") {
            setModalDetail({
                type: type,
                data: Upcoming_temp
            });
        }
        if (type == "Missed") {
            setModalDetail({
                type: type,
                data: Missed_temp
            });
        }
        if (type == "Taken") {
            setModalDetail({
                type: type,
                data: Taken_temp
            });
        }
        setModalVisible(true);
        //setShowPie(true);
    }
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
    const GetReq = () => {
        const date = new Date();
        const path = "/user/" + UserInfo.uid;
        firebase.database().ref(path).on('value', (resp) => {
            // console.log(resp.val());
            let this_date = [];
            for (var i in resp.val()) {
                const d = resp.val()[i];
                if (d.Date == date.toDateString()) {
                    //{"Active": true, "Date": "Tue Jun 07 2022", "Name": "sample 123", "Notes": "asdasd", "Time": "20:53:16"}
                    this_date.push({
                        Active: d.Active,
                        Date: d.Date,
                        Name: d.Name,
                        Notes: d.Notes,
                        Time: d.Time,
                        Key: i,
                        ImagePath: d.ImagePath
                    });
                }
            }
            let Now_temp = 0;
            let Upcoming_temp = 0;
            let Missed_temp = 0;
            let Taken_temp = 0;

            for (var i in this_date) {

                if (this_date[i].Time > date.toLocaleTimeString()) {
                    if (this_date[i].Active) {
                        Upcoming_temp++;
                    } else {
                        Taken_temp++;
                    }
                } else if (this_date[i].Time == date.toLocaleTimeString()) {
                    if (this_date[i].Active) {
                        Now_temp++;
                    }
                } else {
                    if (this_date[i].Active) {
                        Missed_temp++;
                    } else {
                        Taken_temp++;
                    }
                }
            }
            setNowCount(Now_temp);
            setMissedCount(Missed_temp);
            setTakenCount(Taken_temp);
            setUpComingcount(Upcoming_temp);
            setAllFortoday(this_date);
            setPieData([Now_temp, Upcoming_temp, Missed_temp, Taken_temp]);
            if (Now_temp + Upcoming_temp + Missed_temp + Taken_temp > 0) {
                setShowPie(true);
            }

            //setdata(this_date);
        });
    }
    
    const Test2=()=>{
        PushNotification.localNotificationSchedule({
            channelId: "sample id 123456",
            //... You can use all the options from localNotifications
            message: "My Notification Message", // (required)
            date: new Date(Date.now() + 5 * 1000), // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
          
            /* Android Only Properties */
            repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
          });
    }
    const TestNotification=()=>{
        PushNotification.localNotificationSchedule({
            /* Android Only Properties */
            channelId: "sample id 123456", // (required) channelId, if the channel doesn't exist, notification will not trigger.
            bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
            subText: "This is a subText", // (optional) default: none
            // bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
            // bigLargeIcon: "ic_launcher", // (optional) default: undefined
            // bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: "some_tag", // (optional) add tag to message
            group: "group", // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
            // shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
            onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false
            
            when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
          
            messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
          
            actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            date: new Date(Date.now() + 5 * 1000), // in 60 secs
            /* iOS and Android properties */
            id: 'asd', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: "My Notification Title", // (optional)
            message: "My Notification Message", // (required)
            // picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
            userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
          });
    }
    React.useEffect(() => {
        GetReq();
        //PushNotification.cancelLocalNotification('0');
        //Test2();
        // PushNotification.cancelLocalNotification('asd');
       // PushNotification.cancelAllLocalNotifications();
        //TestNotification();
    }, []);
    const GetDate = () => {
        const current_date = new Date();
        return "Today " + current_date.getDate().toString() + " " + MonthtoWord(current_date.getMonth()) + " " + current_date.getFullYear();
    }
    const TakeDose = (x) => {
        console.log(x);
        const path = "/user/" + UserInfo.uid + "/" + x.Key;
        firebase.database()
            .ref(path)
            .update({
                Active: false,
            })
            .then(() => { GetReq; setModalVisible(false); });
    }
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <View style={styles.ModalInnerView}>
                            <Text style={styles.modalText}>{modalDetail.type}</Text>
                            {
                                modalDetail.data && modalDetail.data.map(x =>
                                    <View style={styles.RowView} key={x.key}>
                                        <View style={{ height: '100%', width: '20%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                           
                                                <Image source={{uri: x.ImagePath}} style={{borderRadius:50, height:50, width:50}}/>
                                        </View>
                                        <View style={{ width: '50%', height: '100%', alignContent: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <Text>{x.Name}</Text>
                                            <Text>{x.Notes}</Text>
                                        </View>
                                        <Text style={{ width: '20%', height: '100%', textAlignVertical: 'center' }}>{x.Time}</Text>
                                        {
                                            (modalDetail.type == "Now" || modalDetail.type == "Upcoming") &&
                                            <TouchableOpacity onPress={() => { TakeDose(x) }} style={{ height: '100%', width: '10%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name='check'
                                                    type='entypo'
                                                    color={'green'} />
                                            </TouchableOpacity>
                                        }

                                    </View>
                                )
                            }

                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose, { width: '80%' }]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <ScrollView style={{ width: '100%', height: '100%', alignContent: 'center' }}>


                <Text style={styles.MedicationTitle}>Medication</Text>
                <View style={[styles.DateTimeView, { alignSelf: 'center' }]}>
                    <Text style={styles.DateTimeText}>{GetDate()}</Text>
                </View>
                {
                    ShowPie &&
                    <View style={{ alignContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            widthAndHeight={250}
                            series={[NowCount, UpComingCount, MissedCount, TakenCount]}
                            sliceColor={['#d2e9ba', '#d397ce', '#facdb3', '#b3f3db']}
                            doughnut={true}
                            coverRadius={0.75}
                            coverFill={'#FFEACA'}
                        />
                    </View>
                }

                <View style={[styles.BottomViewMainContainer, { alignSelf: 'center' }]}>
                    <View style={styles.BottomViewSubContainer}>
                        <TouchableOpacity style={styles.NowContainer} onPress={() => { ShowModal('Now') }}>
                            <View style={styles.SubContainerfirstrow}>
                                <Icon
                                    name='stopwatch'
                                    type='fontisto' />
                                <Text style={{ marginHorizontal: '5%', fontWeight: 'bold', fontSize: 15 }}>Now</Text>
                            </View>
                            <View style={styles.SubContainerfirstrow}>
                                <Text style={styles.SubCount}>{NowCount}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.UpComingContainer} onPress={() => { ShowModal('Upcoming') }}>
                            <View style={styles.SubContainerfirstrow}>
                                <Icon
                                    name='clock-o'
                                    type='font-awesome' />
                                <Text style={{ marginHorizontal: '5%', fontWeight: 'bold', fontSize: 15 }}>UpComing</Text>
                            </View>
                            <View style={styles.SubContainerfirstrow}>
                                <Text style={styles.SubCount}>{UpComingCount}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.BottomViewSubContainer}>
                        <TouchableOpacity style={styles.MissedContainer} onPress={() => { ShowModal('Missed') }}>
                            <View style={styles.SubContainerfirstrow}>
                                <Icon
                                    name='exclamation-circle'
                                    type='font-awesome' />
                                <Text style={{ marginHorizontal: '5%', fontWeight: 'bold', fontSize: 15 }}>Missed</Text>
                            </View>
                            <View style={styles.SubContainerfirstrow}>
                                <Text style={styles.SubCount}>{MissedCount}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.TakenContainer} onPress={() => { ShowModal('Taken') }}>
                            <View style={styles.SubContainerfirstrow}>
                                <Icon
                                    name='clock-o'
                                    type='font-awesome' />
                                <Text style={{ marginHorizontal: '5%', fontWeight: 'bold', fontSize: 15 }}>Taken</Text>
                            </View>
                            <View style={styles.SubContainerfirstrow}>
                                <Text style={styles.SubCount}>{TakenCount}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} user={UserInfo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEACA'
    },
    RowView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginTop: 5,
        height: 60
    },
    MedicationTitle: {
        fontSize: 20,
        fontWeight: '700',
        alignSelf: 'center'
    },
    DateTimeView: {
        marginHorizontal: '10%',
        borderWidth: 2,
        borderColor: 'blue',
        marginVertical: '5%',
        padding: 15
    },
    DateTimeText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    BottomViewMainContainer: {
        marginHorizontal: '10%',
        marginVertical: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    BottomViewSubContainer: {
        flexDirection: 'row',
        width: '100%',
        margin: '5%'
    },
    NowContainer: {
        borderWidth: 2,
        borderColor: '#387740',
        backgroundColor: '#d2e9ba',
        width: '50%',
        height: '100%',
        padding: 10,
        margin: '5%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        width: '100%',
        backgroundColor: '#FFEACA'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 20
    },
    UpComingContainer: {
        borderWidth: 2,
        borderColor: '#7c389a',
        backgroundColor: '#d397ce',
        width: '50%',
        height: '100%',
        padding: 10,
        margin: '5%'
    },
    MissedContainer: {
        borderWidth: 2,
        borderColor: '#ac3042',
        backgroundColor: '#facdb3',
        width: '50%',
        height: '100%',
        padding: 10,
        margin: '5%'
    },
    TakenContainer: {
        borderWidth: 2,
        borderColor: '#3171b1',
        backgroundColor: '#b3f3db',
        width: '50%',
        height: '100%',
        padding: 10,
        margin: '5%'
    },
    SubContainerfirstrow: {
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    SubCount: {
        marginHorizontal: '5%',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '10%'
    },
    ModalInnerView: {
        padding: 5,
        backgroundColor: '#FFEACA',
        width: '100%'
    }
});

export default HomeScreen;