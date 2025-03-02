import React, { createContext } from 'react';

interface AuthContextProps {
  stateUser: {
    isAuthenticate: boolean | null;
    user: any;
  };
  dispatch: React.Dispatch<any>;
}

const AuthGlobal = createContext<AuthContextProps>({
  stateUser: {
    isAuthenticate: null,
    user: {},
  },
  dispatch: () => null,
});

export default AuthGlobal;
