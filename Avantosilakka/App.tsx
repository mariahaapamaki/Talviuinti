import React from 'react';
import {useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Location from './components/Location';
import { NavigationContainer } from '@react-navigation/native';

//Navigators
import Main from './navigators/Main'

export default function App() {

  interface Loc1 {
    coords?: LocationObjectCoords;
    timestamp?: number;
    mocked?: boolean;
  }

  interface LocationObjectCoords {
    latitude: number | null;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  }

  //const [dataFromChild, setDataFromChild] = useState<Loc1>({});
  let t2: number
  let t3: number

  /*const HandleDataFromChild = (data: any) => {
    setDataFromChild(data)

    t2 = dataFromChild.coords?.latitude ?? 37
    t3 = dataFromChild.coords?.longitude ?? 102
    console.log(t2)
  } */

  return (
    <NavigationContainer>       
          <Main />
    </NavigationContainer>

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
