import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Modal, Text, Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../services/api';
import { getCurrentUser } from "../context/Auth.actions";
import { Checkbox, TextInput } from 'react-native-paper';
import axios from 'axios';
import geolib from 'geolib';
import { getDistance } from 'geolib';
import { saveUserPlace, savePublicPlace } from '../services/swimmingplace';
import { sanitizeInput } from '../shared/Sanitize';

interface SavePlaceButtonProps {
  placeData: {
    name: string;
    latitude: number;
    longitude: number;
  };
  existingPublicPlaces: Array<{ latitude: number; longitude: number }>; // Existing swimming places
  onSave: (placeData: any) => void; // Function to handle saving the place
}

interface Place {
  name: string;
  latitude: number;
  longitude: number;
}

interface Existing {
  latitude: number; longitude: number 
}


const SavePlaceButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [info, setInfo] = useState('');
  const [publicInfo, setPublicInfo] = useState('');
  const [publicName, setPublicName] = useState('');

  const placeData: Place = props.placeData
  const existingPublicPlaces: Existing[] = props.existingPublicPlaces.filter(x => x.isPublic)


  const handleSave = async () => {
    const updatedPlaceData = {
      ...placeData,
      isPublic: isPublic,
      info: info,
      publicInfo: publicInfo,
      name: publicName,
    };
  
    if (isPublic) {
      const isDuplicate = existingPublicPlaces.some((existingPlace) => {
        try {
          const distance = getDistance(
            { latitude: placeData.latitude, longitude: placeData.longitude },
            { latitude: existingPlace.latitude, longitude: existingPlace.longitude }
          );
          return distance < 50;
        } catch (error) {
          console.error('Error calculating distance:', error);
          return false;
        }
      });
  
      if (isDuplicate) {
        Alert.alert(
          'Virhe',
          'Tämä uintipaikka löytyy jo kartalta eikä sitä voi tallentaa enää uudestaan. Voit kuitenkin lisätä halutessasi kommentin klikkaamalla kartalla olevaa merkkiä.'
        );
        return;
      }
    }
  
    try {
      const result = await saveUserPlace(updatedPlaceData);
      if (result) {
        if (isPublic) {
          const publicResult = await savePublicPlace(updatedPlaceData);
          if (publicResult) {
            Alert.alert('Success', 'Public place saved successfully!');
            setShowModal(false);
          } else {
            Alert.alert('Error', 'Failed to save public place.');
          }
        } else {
          Alert.alert('Success', 'Place saved successfully!');
          setShowModal(false);
        }
      } else {
        Alert.alert('Error', 'Failed to save place.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save place.');
    }
  };
  

  const handlePress = () => {
    const newChecked = !isPublic;
    setIsPublic(newChecked);
  };

  const handleOpenModal = () => {
    setInfo(''); // Reset the input fields
    setPublicInfo(''); // Reset public info field
    setPublicName(''); // Reset public name field
    setShowModal(true); // Open the modal
    setIsPublic(false); // Reset the public place checkbox
  };

  return (
    <View>
      <TouchableOpacity style={styles.actionButton} onPress={handleOpenModal}>
        <Text style={styles.actionButtonText}>Merkitse uinti</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.actionButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Tallenna uintipaikka</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.actionButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Takaisin pääsivulle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Tallenna halutessati kommentti uintikerrasta</Text>
              <TextInput
                style={styles.textInput}
                value={info}
                onChangeText={(text) => setInfo(sanitizeInput(text))}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={isPublic ? 'checked' : 'unchecked'}
                  onPress={handlePress}
                />
                <Text style={styles.checkboxText}>
                  Merkitäänkö samalla uudeksi yleiseksi uintipaikaksi
                </Text>
              </View>

              {isPublic && (
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Uintipaikan nimi tähän"
                    value={publicName}
                    onChangeText={(text) => setPublicName(sanitizeInput(text))}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Uintipaikan lisätiedot tähän"
                    value={publicInfo}
                    onChangeText={(text) => setPublicInfo(sanitizeInput(text))}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    margin: 10,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dim background
  },
  modalView: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'darkblue', // Green color
  },
  cancelButton: {
    backgroundColor: 'darkblue', // Red color
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default SavePlaceButton;




