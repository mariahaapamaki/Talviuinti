import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Location from '../components/Location';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Location}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const HomeNavigator = () => {
  return <MyStack />;
};

export default HomeNavigator;
