import axios from 'axios';
import { getBaseUrl } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../context/Auth.actions';

export const saveComment = async (comment, placeId) => {
  const token = await AsyncStorage.getItem('jwt');
  const user = await getCurrentUser();

  if (!token || !user) {
    throw new Error('User authentication required');
  }

  try {
    const response = await axios.post(
      `${getBaseUrl()}comments`,
      {
        placeId: placeId,
        userId: user.userId,
        userName: user.userName,
        comment: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return response.data; // Return the saved comment data
    } else {
      throw new Error('Failed to save comment'); // Handle unsuccessful response
    }
  } catch (error) {
    console.error('Error saving comment:', error);
    throw error;
  }
};


export const fetchComments = async (placeId) => {
    try {
      const response = await axios.get(`${getBaseUrl()}comments/${placeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };
  
  export const fetchUserSwimmingPlaces = async (userId) => {
    try {
      const response = await axios.get(`${getBaseUrl()}userPlaces/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user swimming places:', error);
      throw error;
    }
  };
  

  export const fetchPublicSwimmingPlaces = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}publicPlaces`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public swimming places:', error);
      throw error;
    }
  };


export const saveUserPlace = async (placeData) => {
    const token = await AsyncStorage.getItem('jwt');
    const user = await getCurrentUser();
  
    if (!token || !user) {
      throw new Error('User authentication required');
    }
  
    try {
      const response = await axios.post(
        `${getBaseUrl()}userPlaces`,
        {
          ...placeData,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving user place:', error);
      throw error;
    }
  };
  
  // Function to save public places
  export const savePublicPlace = async (placeData) => {
    const token = await AsyncStorage.getItem('jwt');
    const user = await getCurrentUser();
  
    if (!token || !user) {
      throw new Error('User authentication required');
    }
  
    try {
      const response = await axios.post(
        `${getBaseUrl()}publicPlaces`,
        {
          ...placeData,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving public place:', error);
      throw error;
    }
  };