import React, { useReducer, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthReducer from '../reducers/Auth.reducer';
import { setCurrentUser } from '../context/Auth.actions';
import AuthGlobal from './AuthGlobal';

export interface DecodedToken {
  userId: string;
  userName: string;
  isAdmin: boolean;
}

const Auth = (props: any) => {
  const [stateUser, dispatch] = useReducer(AuthReducer, {
    isAuthenticate: null,
    user: {},
  });
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setShowChild(true);
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token) as DecodedToken;
          console.log("Decoded token during load:", decoded);

          // Retrieve the user object
          const userString = await AsyncStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          console.log("User during load:", user);

          // Ensure user object includes userId
          const userWithId = user ? { ...user, userId: decoded.userId } : null;
          console.log("User with ID during load:", userWithId);

          // Pass both the decoded token and user object
          if (userWithId) {
            dispatch(setCurrentUser(decoded, userWithId));
          } else {
            dispatch(setCurrentUser(decoded, { userName: decoded.userName, password: '', userId: decoded.userId }));
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();

    return () => setShowChild(false);
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider
        value={{
          stateUser,
          dispatch,
        }}
      >
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;


