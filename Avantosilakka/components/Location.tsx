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
import SwimmingPlace from './SwimmingPlace';


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

  interface Comment {
    _id: string,
    placeId: string,
    userId: string,
    comment: string,
    date: string
  }

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [swimmingPlaces, setSwimmingPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: false,
    checkbox2: false,
  });

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
          fetchSwimmingPlaces();
        }
      );
      fetchSwimmingPlaces();
    })();
  }, []);

  const fetchSwimmingPlaces = async () => {
    try {
      const user = await getCurrentUser();
      const [userPlacesResponse, publicPlacesResponse] = await Promise.all([
        axios.get(`${getBaseUrl()}userPlaces/${user.userId}`),
        axios.get(`${getBaseUrl()}publicPlaces`)
      ]);
      setSwimmingPlaces([...userPlacesResponse.data, ...publicPlacesResponse.data]);
    } catch (error) {
      console.error('Error fetching swimming places:', error);
    }
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const getComments = async (placeId: string) => {
    try {
      const response = await axios.get(`${getBaseUrl()}comments?placeId=${placeId}`);
      const commentList = response.data; // Assuming the response data is an array of comments
      setCommentList(commentList); // Update the state with the comments
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

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
            swimmingPlaces.map((place) => (
              <Marker
                key={place._id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                pinColor={place.isPublic ? "green" : "blue"}
                onPress={() => {
                  if (place.isPublic) {
                    setSelectedPlace(place);
                    getComments(place._id);
                    setShowModal(true);
                  }
                }}
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
              <Text>Paikan nimi: {selectedPlace.name}</Text>
              <Text>Lisätiedot: {selectedPlace.publicInfo}</Text>
              <SwimmingPlace placeId={selectedPlace._id} />
            </View>
          )}

          <Pressable
            style={styles.button}
            onPress={() => setShowModal(false)}
          >
            <Text>Sulje</Text>
          </Pressable>
          <View style={styles.modalView}>
            <Text>Käyttäjien kommentit</Text>
            {commentList.length
              ?  commentList.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Text key={comment.comment}>{comment.comment}</Text>
                  <View key={comment.date} style={styles.userIdText}>
                  <Text key={comment.placeId}>{comment.userId}</Text>
                  </View>
                  </View>
                ))
              : null}
          </View>
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
  userIdText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
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
  button: {
    backgroundColor: '#d9ffb3', // Light grey background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border color
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#333', // Dark grey text color
    fontSize: 16,
    fontWeight: '500'
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
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
})

