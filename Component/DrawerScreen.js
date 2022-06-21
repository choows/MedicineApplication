import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import * as React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Modal, Pressable, Touchable, ScrollView } from 'react-native';
import { Icon } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CustomDrawerContent(props) {
    const UserInfo = JSON.parse(props.state.routes[0]?.params.user)
    const Navigate = (page) => {
        props.navigation.navigate(
            page,
            {
                user: props.state.routes[0]?.params.user
            }
        )
    }
    const Logout=()=>{
        AsyncStorage.clear(()=>{
            props.navigation.navigate(
                'Login'
            )
        });
    }
    return (
        <DrawerContentScrollView {...props} style={{ height: '100%', width: '100%' }}>
            <TouchableOpacity style={styles.upper} onPress={() => { Navigate('Profile') }}>
                <View style={styles.iconView}>
                    <Icon
                        name='person'
                        type='ionicons'
                        size={50} />
                </View>
                <View style={{ height: '100%', width: '80%', padding: 20, alignContent: 'flex-start', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>{"Hello, " + UserInfo.displayName + " !"}</Text>
                    <Text>{UserInfo.email}</Text>
                </View>
            </TouchableOpacity>
            <ScrollView style={{ width: '100%', minHeight:500 }}>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', height:80, padding:10}} onPress={()=>{Navigate('MedicineLog')}}>
                    <Icon
                        name='ios-document'
                        type='ionicon' 
                        size={30}
                        style={{margin:10}}/>
                    <Text style={{fontSize:20 , fontWeight:'600', marginLeft:20, margin:10}}>Medicine Log</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', height:80, padding:10}} onPress={()=>{Navigate('FirstAid')}}>
                    <Icon
                        name='medkit'
                        type='font-awesome' 
                        size={30}
                        style={{margin:10}}/>
                    <Text style={{fontSize:20 , fontWeight:'600', marginLeft:20, margin:10}}>First Aid</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', height:80, padding:10}} onPress={()=>{Navigate('EmegencyContact')}}>
                    <Icon
                        name='phone'
                        type='materialicons' 
                        size={30}
                        style={{margin:10}}/>
                    <Text style={{fontSize:20 , fontWeight:'600', marginLeft:20, margin:10}}>Emergency Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', height:80, padding:10}} onPress={()=>{Navigate('GenerateReport')}}>
                    <Icon
                        name='document'
                        type='ionicon' 
                        size={30}
                        style={{margin:10}}/>
                    <Text style={{fontSize:20 , fontWeight:'600', marginLeft:20, margin:10}}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={Logout} style={{marginTop:300, padding:20 ,bottom:0, margin:5 , backgroundColor:'#e09792' , justifyContent:'center' , alignContent:'center', alignItems:'center'}}>
                    <Text>Log out</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* <DrawerItemList {...props} /> */}
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    upper: {
        height: 100,
        backgroundColor: '#ffb8b3',
        flexDirection: 'row',
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        width: '20%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});