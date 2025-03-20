import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stacks
import Location from "../components/Location";
import UserNavigator from "./UserNavigator";
import AuthGlobal from "../components/AuthGlobal";
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authState = await AsyncStorage.getItem('isAuthenticated');
        if (authState !== null) {
          setIsAuthenticated(JSON.parse(authState));
        }
      } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Virhe',
            });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthState();
  }, []); 

 useEffect(() => {
    if (context.stateUser.isAuthenticate !== null) {
      setIsAuthenticated(context.stateUser.isAuthenticate);
      AsyncStorage.setItem('isAuthenticated', JSON.stringify(context.stateUser.isAuthenticate));
    }
  }, [context.stateUser.isAuthenticate]); 

  if (isLoading) {
    return null;
  }

  return (
<Tab.Navigator
  initialRouteName={isAuthenticated ? "Uintipaikat" : "User"}
  screenOptions={{
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false,
    tabBarActiveTintColor: "blue",
    headerStyle: {
      backgroundColor: "skyblue", // Green background for the header
      height: 40,
    },
    headerTitleStyle: {
      color: "#fff", // White color for the title text
      fontSize: 16,
      paddingLeft: 80, // This aligns the tex
    },
    headerTintColor: "#fff", // White color for back icons and buttons
  
  }}
>
  {isAuthenticated ? (
    <Tab.Screen
      name="Uintipaikat"
      component={Location}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="home" color={color} size={30} />
        ),
        headerTitle: "Uintipaikat", // Custom title
      }}
    />
  ) : null}
      <Tab.Screen
        name="Käyttäjätiedot"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;



