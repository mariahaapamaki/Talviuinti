import { jwtDecode } from 'jwt-decode'; // Ensure correct import
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../components/api';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

interface DecodedToken {
    userId: string;
    userName: string;
    isAdmin: boolean;
    exp: number;
    iat: number;
}

export const loginUser = (user: { userName: string; password: string }, dispatch: any) => {
  fetch(`${getBaseUrl()}users/login`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((data) => {
    if (data && data.token) {
      const token = data.token;
      AsyncStorage.setItem('jwt', token);
      const decoded: DecodedToken = jwtDecode(token) as DecodedToken;
      console.log("Decoded token:", decoded);
      // Include userId in the user object before storing it
      const userWithId = { ...user, userId: decoded.userId };
      console.log("User with ID:", userWithId);
      AsyncStorage.setItem('user', JSON.stringify(userWithId)); // Store user object with userId
      dispatch(setCurrentUser(decoded, userWithId));
    } else {
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your credentials.',
      });
    }
  })
  .catch((err) => {
    Toast.show({
      topOffset: 60,
      type: 'error',
      text1: 'Login failed',
      text2: 'Please check your credentials.',
    });
  });
};

export const setCurrentUser = (decoded: DecodedToken, user: { userName: string; password: string, userId: string }) => {
  console.log("Setting current user:", user);
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};

export const logoutUser = (dispatch: any) => {
    AsyncStorage.removeItem('jwt');
    AsyncStorage.removeItem('user');
    dispatch(setCurrentUser(
      { userId: '', userName: '', isAdmin: false, exp: 0, iat: 0 }, // Include all properties from DecodedToken
      { userName: '', password: '', userId: '' }
    ));
}

export const getCurrentUser = async () => {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      console.log("Retrieved current user:", user); // Add this log
  
      // If userId is missing, retrieve it from the token
      if (!user.userId) {
        const token = await AsyncStorage.getItem('jwt');
        if (token) {
          const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
          user.userId = decoded.userId; // Ensure the user object has the userId property
          // Update the stored user with the userId
          await AsyncStorage.setItem('user', JSON.stringify(user));
          console.log("Updated user with ID:", user);
        }
      }
      return user;
    }
    return null
};








