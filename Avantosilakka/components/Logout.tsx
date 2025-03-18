import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../context/Auth.actions';
import { RootStackParamList } from '../navigators/Main';

const Logout = ({ navigation, handleLogout }: { navigation: NavigationProp<RootStackParamList>, handleLogout: () => void }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      await logoutUser(dispatch);
      handleLogout(); // Call the handleLogout function to update the state
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Käyttäjätiedot' }],
        })
      );
    };

    performLogout();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default Logout;











