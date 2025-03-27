import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import SavePlaceButton from './SavePlaceButton';
import Settings from './LocationScreenSettings';
import { fetchPublicSwimmingPlaces, fetchUserSwimmingPlaces, fetchComments } from '../services/swimmingplace';
import { getCurrentUser } from "../context/Auth.actions";
import SwimmingPlace from './SwimmingPlace';
import Toast from 'react-native-toast-message';


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

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
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
    // Kysytään tarvittaessa lupa sijainnin käyttöön
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
            Toast.show({
              type: 'error',
              text1: 'Lupaa sijaintitietojen käyttöön ei myönnetty',
            });
        return;
      }
    // Haetaan käyttäjän nykyiset sijaintitiedot
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      // Seurataan käyttäjän sijaintia
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

  // Haetaan kaikki tallennetut (sekä käyttäjän yksityiset että yleiset) uintipaikat palvelimelta
  const fetchSwimmingPlaces = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.userId) {
        Toast.show({
          type: 'error',
          text1: 'Käyttäjätietoja ei löydy',
        });
        return;
      }
  
      const [userPlaces, publicPlaces] = await Promise.all([
        fetchUserSwimmingPlaces(user.userId),
        fetchPublicSwimmingPlaces()
      ]);
  
      let places: Place[] = [];
      if (checkboxValues.checkbox1 && checkboxValues.checkbox2) {
        places = [...userPlaces, ...publicPlaces];
      } else if (checkboxValues.checkbox1) {
        places = userPlaces;
      } else if (checkboxValues.checkbox2) {
        places = publicPlaces;
      }
  
      setSwimmingPlaces(places);
    } catch (error) {
      console.error('Virhe:', error);
    }
  };

  // Käsitellään lapsikomponentista tuleva checkbox-muutos
  const handleCheckboxChange = (name: string, value: boolean) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Haetaan valitun yleisen uintipaikan kommentit palvelimelta
  const getComments = async (placeId) => {
    try {
      const comments = await fetchComments(placeId);
      const sortedComments = comments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCommentList(sortedComments);
    } catch {
      setCommentList([]);
    }
  };
  // Määritellään paikkatiedot jotka välitetään propsina
  const placeData = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };
  // Uuden uintipaikan tallennuksen jälkeen päivitetään uintipaikat
  const handleSavePlace = async () => {
    await fetchSwimmingPlaces();
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
   {swimmingPlaces.map((place) => {
    const pinColor = place.isPublic ? "green" : "blue";

    return (
      <Marker
        key={place._id}
        coordinate={{
          latitude: place.latitude,
          longitude: place.longitude,
        }}
        pinColor={pinColor}
        onPress={() => {
          if (place.isPublic) {
            setSelectedPlace(place);
            getComments(place._id);
            setShowModal(true);
          }
        }}
        tracksViewChanges={false}
      />
    );
  })}
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
          {selectedPlace && (
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

          <Text style={styles.header2}>Käyttäjien kommentit</Text>

          <ScrollView style={styles.scrollContainer}>

            {commentList.length > 0
              ?  commentList.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Text key={comment.comment} style={styles.commentText}>{comment.comment}</Text>
                  <Text key={comment.date} style={styles.userText}>{comment.userName}</Text>
                  </View>
                ))
              :               
              <Text>Ei kommentteja</Text>}
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.buttonRow}>
      <SavePlaceButton
  placeData={placeData}
  existingPublicPlaces={swimmingPlaces}
  onSave={handleSavePlace} 
/>

      <Settings onCheckboxChange={handleCheckboxChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
  actionButton: {
    margin: 10,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500'
  },
  modalView: {
    margin: 20,
    width: '90%',
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
  scrollContainer: {
    maxHeight: '60%', 
    width: '80%', 
    marginTop: 20,
  },
  commentContainer: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  commentText: {
    fontSize: 16,
    color: '#333', 
  },
  userText: {
    fontSize: 14,
    color: '#777', 
    marginTop: 5, 
    fontStyle: 'italic',
  },
});

