import axios from 'axios';

const API_URL = 'http://192.168.100.9:3000/api/v1/userplaces';  // replace with your actual backend URL

export const saveUserPlace = async (placeData) => {
  try {
    const response = await axios.post(API_URL, placeData);
    return response.data;
  } catch (error) {
    console.error('Error saving user place:', error);
    throw error;
  }
};
