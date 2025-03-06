import React, { useEffect } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const simpleLogout = async () => {
  try {
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
 
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const Logout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const logoutAndNavigate = async () => {
      await simpleLogout();
      // Resetting the navigator state and navigating to the Login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Käyttäjätiedot', params: { screen: 'Login' } }],
        })
      );
    };

    logoutAndNavigate();
  }, [navigation]);

  return null;
};

export default Logout;







