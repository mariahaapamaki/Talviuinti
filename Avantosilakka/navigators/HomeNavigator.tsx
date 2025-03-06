import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Location from '../components/Location';
import SwimmingPlace from '../components/SwimmingPlace';
import Login from '../userComponents/Login';
import { getCurrentUser } from '../context/Auth.actions';

const Stack = createStackNavigator();

interface MainProps {
  isLoggedIn: boolean | undefined;
  handleLogin: () => void;
}

const HomeNavigator: React.FC<MainProps> = ({ isLoggedIn, handleLogin }) => {
    const [isId, setIsId] = useState(false);
  
    const checkId = async () => {
        const currentUser = await getCurrentUser();
        return currentUser && currentUser.userId ? true : false;
    };
  
    useEffect(() => {
        const initializeId = async () => {
            const id = await checkId();
            setIsId(id);
        };
  
        initializeId();
    }, []);

  return (
    <>
      {isId ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Location}
            options={{
              headerShown: true, // Ensure header is shown
              title: 'Uintipaikat', // Set the header title
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Login}
            options={{
              headerShown: true, // Ensure header is shown
              title: 'Kirjautuminen', // Set the header title
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default HomeNavigator;



