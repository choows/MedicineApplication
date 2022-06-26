import * as React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';

function SplashScreen({ navigation }) {


  const onPress = () => {
    navigation.navigate('Login')
  }

  
  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Medical 2R & First Aid</Text>
      <Image style={styles.ImageStyle} source={require('../Images/Background_Image_Splash.png')} />
      <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
        <Text style={styles.buttonfont}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ABECEE',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    backgroundColor: '#FEFBAC',
    padding:15
  },
  buttonfont:{
    fontSize: 25,
    color:'blue',
    fontWeight:'500'
  },
  ImageStyle: {
    width: '100%',
    resizeMode: 'stretch',
    height: '50%'
  },
  Header: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold'
  }
});
export default SplashScreen;