import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Pressable, Alert, Button} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import SavePlaceButton from './SavePlaceButton';
import GetButton from './LocationScreenSettings';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../services/api';
import { getCurrentUser } from "../context/Auth.actions";
import axios from 'axios';
import { saveComment } from '../services/swimmingplace';

interface SwimmingPlaceProps {
  placeId: string | number | undefined;
}

const SwimmingPlace =  (props: SwimmingPlaceProps) => {
  const [placeComment, setPlaceComment] = useState('')
  const placeId = props.placeId

  const handleSave = async (comment) => {
    try {
      const savedComment = await saveComment(comment, placeId);
      Toast.show({
        type: 'success',
        text1: 'Comment saved successfully!',
      });
      console.log('Saved comment:', savedComment);
      return savedComment;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save comment.',
      });
      console.error('Error:', error);
    }
  };
  


  return (
    <View>
      <Text>Kirjoita halutessasi kommentti paikasta </Text>
      <TextInput
          placeholder='Kommentti' 
          value={placeComment}
          onChangeText={(text) => setPlaceComment(text)}
      />
      <Button title="Tallenna kommentti" onPress={() => handleSave(placeComment)}></Button>
      <Toast/>
    </View>
  );
};

export default SwimmingPlace;