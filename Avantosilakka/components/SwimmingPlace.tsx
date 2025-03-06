import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Pressable, Alert, Button} from 'react-native';
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

interface SwimmingPlaceProps {
  placeId: string | number | undefined;
}

const SwimmingPlace =  (props: SwimmingPlaceProps) => {
  const [placeComment, setPlaceComment] = useState('')
  const placeId = props.placeId

  const HandleSave = async (comment: string) => {
    console.log(comment)
    const token = await AsyncStorage.getItem('jwt');
    const user = await getCurrentUser(); 
    if (!token || !user) {
      console.log('No token or user found');
      return;
    }
    
    try {
       const response = await fetch(`${getBaseUrl()}comments`, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          placeId: placeId,
           userId: user.userId,
           comment: comment,
  
         }),
       });
       console.log(JSON.stringify({
        placeId: placeId,
         userId: user.userName,
         comment: comment,

       }))
       if (response.status === 200 || response.status === 201) {
         const data = await response.json();
         Toast.show({
           type: 'success',
           text1: 'Comment saved successfully!',
         });
         return data;
       } else {
         Toast.show({
           type: 'error',
           text1: 'Failed to save comment.',
         });
       }
     } catch (error) {
       Toast.show({
         type: 'error',
         text1: 'Error saving comment.',
       });
     }
    };
  


  return (
    <View>
      <Text>Kirjoita halutessasi kommentti paikasta</Text>
      <TextInput
          placeholder='Kommentti'
          value={placeComment}
          onChangeText={(text) => setPlaceComment(text)}
      />
      <Button title="Tallenna kommentti" onPress={() => HandleSave(placeComment)}></Button>
      <Toast/>
    </View>
  );
};

export default SwimmingPlace;