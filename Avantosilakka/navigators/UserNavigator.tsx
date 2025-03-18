import React, { useContext } from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../userComponents/Login';
import SignUp from '../userComponents/SignUp';
import UserProfile from '../userComponents/UserProfile';
import AuthGlobal from "../components/AuthGlobal";

const Stack = createStackNavigator();

function MyStack() {
  const context = useContext(AuthGlobal);

  return (
    <Stack.Navigator>
      {!context.stateUser.isAuthenticate ? (
        <Stack.Screen 
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
      ) : (
        <Stack.Screen 
          name="User Profile"
          component={UserProfile}
          options={{
            headerShown: false
          }}
        />
      )}
      <Stack.Screen 
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return <MyStack />;
}













































