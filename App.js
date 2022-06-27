
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Navigation/Login';
import SplashScreen from "./Navigation/SplashScreen";
import CreateAccount from './Navigation/CreateAccount';
import HomeScreen from "./Navigation/HomeScreen";
import { TopLeftNavigation } from "./Component/TopNavigation";
import AddMedicine from "./Navigation/AddMedicine";
import MedicineLog from "./Navigation/MedicineLog";
import FirstAid from "./Navigation/FirstAid";
import Profile from "./Navigation/Profile";
import EmergencyContact from "./Navigation/EmergencyContact";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from "./Component/DrawerScreen";
import GenerateReport from "./Navigation/GenerateReport";
import EditMedicine from "./Navigation/EditMedicine";
import FirstAidDetail from "./Navigation/FirstAidDetail";


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Drawers() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"Medical 2R & First Aid"} />
        )
      }} />

      <Drawer.Screen name='MedicineLog' component={MedicineLog} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"Medical Log"} />
        )
      }} />
      <Drawer.Screen name='FirstAid' component={FirstAid} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"First Aid"} />
        )
      }} />
      <Drawer.Screen name='Profile' component={Profile} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"My Profile"} />
        )
      }} />
      <Drawer.Screen name='EmegencyContact' component={EmergencyContact} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"Emergency Contact"} />
        )
      }} />
      <Drawer.Screen name='GenerateReport' component={GenerateReport} options={{
        header: (props) => (
          <TopLeftNavigation navigation={props} title={"Reports"} />
        )
      }} />
      <Drawer.Screen name='EditMedicine' component={EditMedicine} options={{
          header: (props) => (
            <TopLeftNavigation navigation={props} title={"Edit Reminder"} />
          )
        }} />
        <Drawer.Screen name='FirstAidDetail' component={FirstAidDetail} options={{
          header: (props) => (
            <TopLeftNavigation navigation={props} title={"First Aid"} />
          )
        }} />

        <Drawer.Screen name='AddMedicine' component={AddMedicine} options={{
          header: (props) => (
            <TopLeftNavigation navigation={props} title={"Add Reminder"} />
          )
        }} />
    </Drawer.Navigator>
  );
}


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} options={{ headerShown: false }} />
        
        <Stack.Screen
          name="Main"
          component={Drawers}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;