import {useState, useEffect, useRef } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Location from './components/Location';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message'

//Context API
import Auth from './components/Auth'

//Navigators
import Main from './navigators/Main'

export default function App() {
  
      return (
        <Auth>
        <NavigationContainer>       
          <Main />
          <Toast/>
        </NavigationContainer>
        </Auth>
      );
    }
    

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
  },
});
