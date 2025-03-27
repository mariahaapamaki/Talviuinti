import React, { useReducer, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import AuthReducer from '../reducers/Auth.reducer';
import { loginUser, setCurrentUser } from '../context/Auth.actions';
import AuthGlobal from './AuthGlobal';
import AuthReducer, { initialState } from '../reducers/Auth.reducer';

export interface DecodedToken {
  exp: any,
  iat: any,
  userId: string;
  userName: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

interface Action {
  type: string;
  payload?: any;
  userProfile?: any;
}

const Auth = (props: any) => {
  const [stateUser, dispatch] = useReducer<typeof AuthReducer>(AuthReducer, {
    isAuthenticate: initialState.isAuthenticate,
    user: {},
    userProfile: null,
  });
  
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setShowChild(true);
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token) as DecodedToken;
          const userString = await AsyncStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          const userWithId = user ? { ...user, userId: decoded.userId } : null;

          if (userWithId) {
            dispatch(setCurrentUser(decoded, userWithId));
          } else {
            dispatch(setCurrentUser(decoded, { userName: decoded.userName, password: '', userId: decoded.userId, firstName: decoded.firstName, lastName: decoded.lastName }));
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


