import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Pressable, Alert} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import SavePlaceButton from './SavePlaceButton';
import GetButton from './ShowSwimmingPlaceButton';
import { getAllSwimmingPlaces } from './api';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../components/api';
import { getCurrentUser } from "../context/Auth.actions";
import axios from 'axios';


export default function ShowLocation() {
  interface Place {
    _id: string,
    latitude: number,
    longitude: number,
    date: string,
    userId: string,
    isPublic: boolean,
    name: string,
    publicInfo: string,
    comment: string
  }

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [swimmingPlaces, setSwimmingPlaces] = useState<Place[]>([]);
  const[selectedPlace, setSelectedPlace] = useState<Place | null>();
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: false,
    checkbox2: false,
  })

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
        }
      );

      const getPublicSwimmingPlaces = async () => {
        try {
          const response = await axios.get(`${getBaseUrl()}publicPlaces`);
          return response.data;
        } catch (error) {
          console.error('Error fetching user places:', error);
          throw error;
        }
      };

      const getAllSwimmingPlaces2 = async () => {
        const user = await getCurrentUser();
        try {
          const response = await axios.get(`${getBaseUrl()}userPlaces/${user.userId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching user places:', error);
          throw error;
        }
      };

      const places = await getAllSwimmingPlaces2();
      const places2 = await getPublicSwimmingPlaces()
      setSwimmingPlaces(places);
      const addNewPlaces = (newPlaces: any) => {
        setSwimmingPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);}
      addNewPlaces(places2)
    })();
  }, []);

  const handleCheckboxChange = (name: string, value: boolean) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    console.log('Checkbox values:', { ...checkboxValues, [name]: value });
  };

  const markerClick = () => {
    setShowModal(true);
  };
  //      <Image source={require('./download3.png')} style={styles.image} />
  const placeData = {
    name: 'My Place',
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          showsUserLocation={true}
          onRegionChangeComplete={(region) => setMapRegion(region)}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              pinColor="red"
            />
          )}
          {swimmingPlaces.length > 0 &&
            swimmingPlaces.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                pinColor={place.isPublic ? "green" : "blue"}
                onPress={() => {
                  console.log(place)
                  if (place.isPublic) {
                    setSelectedPlace(place)
                    setShowModal(true)
                  }}}
              />
            ))}
        </MapView>
      )}
            <Modal
        style={styles.modal}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.modalView}>
          {selectedPlace && ( // Render selected place data in modal
            <View>
              <Text>Name: {selectedPlace.name}</Text>
              <Text>Info: {selectedPlace.publicInfo}</Text>
            </View>
          )}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setShowModal(false)}
          >
            <Text>Sulje</Text>
          </Pressable>
        </View>
      </Modal>

      <SavePlaceButton placeData={placeData} />
      <GetButton onCheckboxChange={handleCheckboxChange} />
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
  image: {
    width: 100,
    height: 100,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
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
