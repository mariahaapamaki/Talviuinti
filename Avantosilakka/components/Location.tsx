import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, Button } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import SavePlaceButton from './SavePlaceButton';
import GetButton from './ShowSwimmingPlaceButton';
import axios from 'axios';
import { getBaseUrl } from '../components/api';
import { getCurrentUser } from "../context/Auth.actions";
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
    onSave: () => Promise<void>;
  }

  interface Comment {
    _id: string,
    placeId: string,
    userId: string,
    userName: string,
    comment: string,
    date: string
  }

  interface SavePlaceButtonProps {
    placeData: {
      name: string;
      latitude: number;
      longitude: number;
    };
  }

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [swimmingPlaces, setSwimmingPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: true,
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
        }
      );
    })();
  }, []);

  useEffect(() => {
    fetchSwimmingPlaces();
  }, [checkboxValues]);

  const fetchSwimmingPlaces = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.userId) {
        console.log('User is not logged in');
        return;
      }

      const [userPlacesResponse, publicPlacesResponse] = await Promise.all([
        axios.get(`${getBaseUrl()}userPlaces/${user.userId}`),
        axios.get(`${getBaseUrl()}publicPlaces`)
      ]);

      let places: Place[] = [];
      if (checkboxValues.checkbox1 && checkboxValues.checkbox2) {
        places = [...userPlacesResponse.data, ...publicPlacesResponse.data];
      } else if (checkboxValues.checkbox1) {
        places = userPlacesResponse.data;
      } else if (checkboxValues.checkbox2) {
        places = publicPlacesResponse.data;
      }

      setSwimmingPlaces(places);
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
      console.log(`Fetching comments for placeId: ${placeId}`); 
      const response = await axios.get(`${getBaseUrl()}comments/${placeId}`);
      if (response.status === 200 || response.status === 201) {
        console.log('Response data:', response.data);

        const commentList = response.data !== null || response.data.length > 0 ? response.data : []
        // Sort comments by date in descending order
        if (commentList.length > 0) {
        commentList.sort((a: Comment, b: Comment) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        setCommentList(commentList); 
      } else {
        console.error('Unexpected response status:', response.status);
        setCommentList([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentList([]); 
    }
  };

  const placeData = {
    name: 'My Place',
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  const handleSavePlace = async () => {
    // Save place logic here
    await fetchSwimmingPlaces(); // Fetch swimming places after saving
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
              <Text style={styles.header}> {selectedPlace.name}</Text>
              <Text>Lisätiedot: {selectedPlace.publicInfo}</Text>
              <SwimmingPlace placeId={selectedPlace._id} />
            </View>
          )}

          <Button
          title="Sulje"
            onPress={() => setShowModal(false)}
          >
          </Button>
          <View style={styles.modalView}>
            <Text>Käyttäjien kommentit</Text>
            {commentList.length > 0
              ?  commentList.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Text key={comment.comment}>{comment.comment}</Text>
                  <Text key={comment.date} style={styles.commentText}>{comment.userName}</Text>
                  </View>
                ))
              :               
              <Text>Ei kommentteja</Text>}
          </View>
        </View>
      </Modal>
      <SavePlaceButton
  placeData={placeData} // Prop for place-specific data
  existingPublicPlaces={swimmingPlaces} // Prop for existing swimming places
  onSave={handleSavePlace} // Prop for a callback function
/>

      <GetButton onCheckboxChange={handleCheckboxChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
    height: '80%',
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
  commentText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

