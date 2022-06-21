import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Header } from "@rneui/themed";
import { Icon } from "@rneui/themed";

export default function BottomNavigationBar(props) {

    const NavigateToScreen = (page) => {
        
        props.navigation.navigate(
            page,
            {
                user: JSON.stringify(props.user)
            }
        )
    }

    return (
        <View style={styles.MainView}>
            <TouchableOpacity style={styles.SmallButtonView} onPress={()=>{NavigateToScreen('Home')}}>
                <Icon
                    name='calendar'
                    type='font-awesome' />
                <Text>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SmallButtonView} onPress={()=>{NavigateToScreen('MedicineLog')}}>
                <Icon
                    name='ios-document'
                    type='ionicon' />
                <Text>Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SmallButtonView} onPress={() => { NavigateToScreen('AddMedicine') }}>
                <Icon
                    name='plus'
                    type='font-awesome' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.SmallButtonView} onPress={()=>{NavigateToScreen('FirstAid')}}>
                <Icon
                    name='medkit'
                    type='font-awesome' />
                <Text>First Aid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SmallButtonView} onPress={()=>{NavigateToScreen('Profile')}}>
                <Icon
                    name='person'
                    type='fontisto' />
                <Text>Profile</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    MainView: {
        height: '10%',
        backgroundColor: '#f9caaa',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row'
    },
    SmallButtonView: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    }
});