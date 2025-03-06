import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Modal, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../components/api';
import { getCurrentUser } from "../context/Auth.actions";
import { Checkbox, TextInput } from 'react-native-paper';
import axios from 'axios';

interface SavePlaceButtonProps {
  placeData: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

const saveUserPlace2 = async (placeData: any) => {
  const token = await AsyncStorage.getItem('jwt');
  const user = await getCurrentUser(); 

  if (!token || !user) {
    console.error('No token or user found');
    return;
  }

  try {
    const response = await fetch(`${getBaseUrl()}userPlaces`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...placeData,
        userId: user.userId, // Ensure userId is being set correctly
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      Toast.show({
        type: 'success',
        text1: 'Place saved successfully!',
      });
      return data;
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to save place.',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error saving place.',
    });
  }
};

const savePublicPlace = async (placeData: any) => {
  const token = await AsyncStorage.getItem('jwt');
  const user = await getCurrentUser();

  if (!token || !user) {
    console.error('No token or user found');
    return;
  }

  try {
    const response = await axios.post(`${getBaseUrl()}publicPlaces`, {
      ...placeData,
      userId: user.userId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
console.log(placeData)
    if (response.status === 200 || response.status === 201) {
      Toast.show({
        type: 'success',
        text1: 'Public place saved successfully!',
      });
      return response.data;
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to save public place.',
      });
    }
  } catch (error) {
    console.error('Error saving public place:', error);
    Toast.show({
      type: 'error',
      text1: 'Error saving public place.',
    });
  }
};

const SavePlaceButton = (props: SavePlaceButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [info, setInfo] = useState('');
  const [publicInfo, setPublicInfo] = useState('');
  const [publicName, setPublicName] = useState('');
  const placeData = props.placeData

  const handleSave = async () => {
    const updatedPlaceData = {
      ...placeData,
      isPublic: isPublic,
      info: info,
      publicInfo: publicInfo,
      name: publicName,
    };
    try {
      const result = await saveUserPlace2(updatedPlaceData);
      if (result) {
        if (isPublic) {
          const publicResult = await savePublicPlace(updatedPlaceData);
          if (publicResult) {
            Alert.alert('Success', 'Public place saved successfully!');
            setShowModal(false)
          } else {
            Alert.alert('Error', 'Failed to save public place.');
          }
        } else {
          Alert.alert('Success', 'Place saved successfully!');
          setShowModal(false)
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

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setShowModal(true)}><Text>Merkitse uinti</Text></Pressable>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Kommentti uintikerrasta</Text>
            <TextInput
              style={styles.textInput}
              value={info}
              onChangeText={(text) => setInfo(text)}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isPublic ? 'checked' : 'unchecked'}
                onPress={handlePress}
              />
              <Text style={styles.text}>Merkitäänkö samalla uudeksi yleiseksi uintipaikaksi</Text>
            </View>
            {isPublic ? (
              <View>
                <TextInput
                  placeholder='Uintipaikan nimi tähän'
                  value={publicName}
                  onChangeText={(text) => setPublicName(text)}
                />
                <TextInput
                  placeholder='Uintipaikan lisätiedot tähän'
                  value={publicInfo}
                  onChangeText={(text) => setPublicInfo(text)}
                />
              </View>
            ) : null}

            <View style={styles.saveButton}>
              <Button title="Tallenna uintipaikka" onPress={handleSave} />
            </View>
            <View style={styles.cancelButton}>
              <Button title="Peru" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    padding: 2,
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  saveButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600'
    }
});

export default SavePlaceButton;




