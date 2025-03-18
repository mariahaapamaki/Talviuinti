import { jwtDecode } from 'jwt-decode'; // Ensure correct import
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getBaseUrl } from '../components/api';

export const SET_CURRENT_USER = "SET_CURRENT_USER";

interface DecodedToken {
  userId: string;
  userName: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}

export const loginUser = async (user: { userName: string; password: string }, dispatch: any): Promise<boolean> => {
  try {
    const response = await fetch(`${getBaseUrl()}users/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data && data.token) {
      const token = data.token;
      await AsyncStorage.setItem('jwt', token);
      const decoded: DecodedToken = jwtDecode(token) as DecodedToken;
      const userWithId = { ...user, userId: decoded.userId, firstName: decoded.firstName, lastName: decoded.lastName };
      await AsyncStorage.setItem('user', JSON.stringify(userWithId)); // Store user object with userId
      dispatch(setCurrentUser(decoded, userWithId));
      return true;
    } else {
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your credentials.',
      });
      return false;
    }
  } catch (err) {
    Toast.show({
      topOffset: 60,
      type: 'error',
      text1: 'Login failed',
      text2: 'Please check your credentials.',
    });
    return false;
  }
};

export const getCurrentUser = async () => {
  const userString = await AsyncStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);

    // If userId is missing, retrieve it from the token
    if (!user.userId) {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        user.userId = decoded.userId; // Ensure the user object has the userId property
        console.log('test',user)
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log("Updated user with ID:", user);
      }
    }
    console.log('test',user)
    return user;
  }
  return null;
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}, {}));
};

export const setCurrentUser = (decoded: any, user: any) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};








