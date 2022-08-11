import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Touchable, ScrollView, Image } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import { ShowNormalAlert } from "../CommonFunction/Alert";
import * as CommonMessage from "../CommonFunction/CommonString";
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNavigationBar from "../Component/BottomNavigationBar";
import { Icon } from "@rneui/themed";
import Accordion from 'react-native-collapsible/Accordion';
import Video from 'react-native-video';
import * as videoList from "../Videos/video_list";


function FirstAidDetail({ route, navigation }) {
    const { user, details } = route.params;
    const UserInfo = JSON.parse(user)
    const detail = JSON.parse(details)
    const [activeSection, setActiveSection] = React.useState([0]);
    React.useEffect(() => {
        //changeDate(0);
        // console.log(detail[0].Video);
    }, []);
    const _renderHeader = (section) => {
        return (
            <View style={{ width: '100%', backgroundColor: '#f2c796', padding: 10 }}>
                <Text style={{ fontWeight: '900', padding: 10, fontSize: 17 }}>{section.Title}</Text>
            </View>
        );
    };
    const _onchange = (active_section) => {
        setActiveSection(active_section);
    }
    const _renderContent = (section) => {
        return (
            <View style={styles.content}>
                {
                    section.image_url &&
                    <View style={{ padding: 10, maxHeight: 700 }}>
                        <Image
                            style={{ width: '100%', height: '100%', resizeMode:'contain' }}
                            source={{ uri: section.image_url }}
                        />
                    </View>
                }
                {
                    section.Video &&
                    <View style={{ maxHeight: 300, width: '100%', padding: 10 }}>
                        <Video
                            controls={true}
                            source={{ uri: section.Video }}
                            style={{ width: '100%', height: '100%' }} resizeMode={'contain'}/>
                    </View>
                }
                {
                    section.Subtitle.split("\\n").map(x =>
                        <Text style={{ padding: 15, fontSize: 15 }} key={x}>
                            {x}
                        </Text>
                    )
                }
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }}>
                <Accordion
                    sections={detail}
                    activeSections={activeSection}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_onchange}
                />
                <View style={{ height: 150 }}>

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
export default FirstAidDetail;