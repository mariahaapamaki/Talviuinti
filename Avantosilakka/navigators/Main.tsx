import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import Logout from '../components/Logout';
import Login from '../userComponents/Login';
import { getCurrentUser } from '../context/Auth.actions';
import Location from '../components/Location'

export type RootStackParamList = {
  Käyttäjätiedot: undefined;
  Uintipaikka: undefined;
  Logout: undefined;
  Login: undefined;
}

const Tab = createBottomTabNavigator<RootStackParamList>();

interface MainProps {
  isLoggedIn: boolean;
  handleLogin: () => void;
}

const Main: React.FC<MainProps> = ({ isLoggedIn, handleLogin }) => {
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
  console.log(isId);
  return (
    <Tab.Navigator
      initialRouteName={isId ? 'Uintipaikka' : 'Käyttäjätiedot'}
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e9e63',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: route.name === 'Login' ? 'none' : 'flex',
        },
      })}
    >
      <Tab.Screen
        name="Käyttäjätiedot"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" style={{ position: 'relative' }} color={color} size={30} />
          ),
          headerShown: false,
        }}
      >
        {() => <UserNavigator onLogin={handleLogin} />}
      </Tab.Screen>
      {isId ? (
      <Tab.Screen
        name="Uintipaikka"
        component = {Location}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="map" style={{ position: 'relative' }} color={color} size={30} />
          ),
          headerShown: false,
        }}
      >
      </Tab.Screen>)
      :
      (      <Tab.Screen
        name="Login"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" style={{ position: 'relative' }} color={color} size={30} />
          ),
          headerShown: false,
        }}
      >
        {() => <UserNavigator onLogin={handleLogin} />}
      </Tab.Screen>)}
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="sign-out" style={{ position: 'relative' }} color={color} size={30} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;















