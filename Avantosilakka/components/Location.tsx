import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import SavePlaceButton from './SavePlaceButton';

export default function ShowLocation() {
  const [location, setLocation] = useState<Loc1>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setRegion] = useState<Region>();
  const [showModal, setShowModal] = useState(false);

  interface Loc1 {
    coords: LocationObjectCoords;
    timestamp?: number;
    mocked?: boolean;
  }

  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  interface LocationObjectCoords {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude ?? 0;
      const longitude = location.coords.longitude ?? 0;
      setLocation(location);
      setRegion({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
    })();
  }, []);

  const markerClick = () => {
    setShowModal(true);
  };

  let text = 'Waiting..';
  let test2 = { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 };

  if (errorMsg) {
    text = errorMsg;
  } else if (location && location.coords) {
    text = JSON.stringify(location);
  }

  test2 = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const placeData = {
    name: 'My Place',
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  return (
    <View style={styles.container}>
      <Text>AVANTOSILAKKA</Text>
      <MapView
        style={styles.map}
        initialRegion={test2}
        region={test2}
        zoomTapEnabled={true}
        showsUserLocation={true}
        onRegionChange={(region) => setRegion(region)}
        onMarkerPress={() => markerClick()}
      >
        <Marker coordinate={{ latitude: test2.latitude, longitude: test2.longitude }} />
      </MapView>
      <Modal style={styles.modal} visible={showModal} onRequestClose={() => { setShowModal(false); }}>
        <View style={styles.modalView}>
          <Text>Tänne voi vaikka merkkailla uintipaikkoja</Text>
          <TextInput style={styles.input} placeholder="Kirjoita tähän" />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setShowModal(false)}
          >
            <Text>Sulje</Text>
          </Pressable>
        </View>
      </Modal>
      <SavePlaceButton placeData={placeData} />
      <Text>{JSON.stringify(test2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '75%',
  },
  modal: {
    width: '60%',
    height: '30%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    fontWeight: 'bold',
    color: 'white',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    fontWeight: 'bold',
    color: 'white',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
