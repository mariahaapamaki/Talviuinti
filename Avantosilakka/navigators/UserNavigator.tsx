import React, { useEffect, useContext, useState, FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthGlobal from '../components/AuthGlobal';
import Login from '../userComponents/Login';
import SignUp from '../userComponents/SignUp';
import UserProfile from '../userComponents/UserProfile';
import HomeNavigator from '../navigators/HomeNavigator';

const Stack = createStackNavigator();

interface UserNavigatorProps {
  onLogin: () => void;
}

const UserNavigator: FunctionComponent<UserNavigatorProps> = ({ onLogin }) => {
  const context = useContext(AuthGlobal);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (context.stateUser.isAuthenticate === true) {
      setIsAuthenticated(true);
      onLogin(); // Call the onLogin function to update the login status in Main
    }
  }, [context.stateUser.isAuthenticate, onLogin]);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="UserHome"
          component={HomeNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={Login}
            options={{
              headerShown: false, // Hide header for LoginScreen
            }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUp}
            options={{
              headerShown: false, // Hide header for SignUpScreen
            }}
          />
          <Stack.Screen
            name="UserProfileScreen"
            component={UserProfile}
            options={{
              headerShown: false, // Hide header for UserProfileScreen
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default UserNavigator;










