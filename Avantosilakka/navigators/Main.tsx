import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"
import HomeNavigator from './HomeNavigator'

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Uintipaikka"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e9e63',
        tabBarInactiveTintColor: 'gray'
      }}
    >
      <Tab.Screen
      name="Uintipaikka"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon 
          name="home"
          style={{ position: "relative"}} 
          color={color} 
          size={30} />
        ),
      }}
      />
    {/*<Tab.Screen
      name="Reports"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon 
          name="swimmer"
          style={{ position: "relative"}} 
          color={color} 
          size={30} />
        ),
      }}
      />*/}
    </Tab.Navigator> 
  ); 
}; 

export default Main;
