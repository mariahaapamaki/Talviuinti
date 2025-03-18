import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Header from './components/Header'
import { Provider } from 'react-redux';
import store from './Redux/store';
import Auth from './components/Auth';
import AppNavigator from './navigators/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <Auth>
        <NavigationContainer>
          <Header />
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </Auth>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
  },
});

