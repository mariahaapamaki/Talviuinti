import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"
import HomeNavigator from './HomeNavigator'
import UserNavigator from "./UserNavigator"

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Käyttäjätiedot"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e9e63',
        tabBarInactiveTintColor: 'gray'
      }}
    >
          <Tab.Screen
      name="Käyttäjätiedot"
      component={UserNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon 
          name="user"
          style={{ position: "relative"}} 
          color={color} 
          size={30} />
        ),
      }}
      />
      <Tab.Screen
      name="Uintipaikka"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon 
          name="map"
          style={{ position: "relative"}} 
          color={color} 
          size={30} />
        ),
      }}
      />
    </Tab.Navigator> 
  ); 
}; 

export default Main;
