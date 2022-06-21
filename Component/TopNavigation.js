import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Header } from "@rneui/themed";
import { Icon } from "@rneui/themed";
export function TopLeftNavigation(props) {
    return (
        <Header
            leftComponent={<Icon
                name='menu'
                type='entypo'
                onPress={() => {props.navigation.navigation.openDrawer();}} />}
            centerComponent={<Text style={styles.MainText}>{props.title}</Text>}
            backgroundColor={"#f9caaa"}
        />
    )
}

const styles = StyleSheet.create({
    MainText:{
        fontSize:20,
        textAlignVertical:'center',
        textAlign:'center',
        fontWeight : 'bold'
    }
});