import axios from 'axios';

const API_URL = 'http://192.168.100.10:3000/api/v1/userplaces'
const API_URL_GET_SWIMMINGPLACES = 'http://192.168.100.10:3000/api/v1/userPlaces'
const API_BASEURL = 'http://192.168.100.10:3000/api/v1/'

export const getBaseUrl= () => {
  return API_BASEURL
}

export const saveUserPlace = async (placeData) => {
  try {
    const response = await axios.post(API_URL, placeData);
    return response.data;
  } catch (error) {
    console.error('Error saving user place:', error);
    throw error;
  }
};

