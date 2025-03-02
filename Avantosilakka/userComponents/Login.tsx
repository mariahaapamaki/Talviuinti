import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import Error from '../shared/Error';

import AuthGlobal from '../components/AuthGlobal';
import {loginUser} from '../context/Auth.actions'

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  UserProfile: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const Login = (props: LoginProps) => {
  const { navigation } = props;
  const context = useContext(AuthGlobal)
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (context.stateUser.isAuthenticate === true) {
        navigation.navigate('UserProfile');
      }
    } catch (error) {
    }
  }, [context.stateUser.isAuthenticate, navigation]);

  const handleSubmit = () => {
    const user = {
      userName,
      password,
    };
    if (userName === '' || password === '') {
      setError('Tarkista käyttäjätunnus ja salasana');
    } else {
      loginUser(user, context.dispatch);
    }
  };
  
      

  return (
    <View style={styles.container}>
      <Image source={require('../components/download3.png')} style={styles.image} />
      <Text style={styles.header}>Kirjaudu Avantosilakkaan</Text>
      <TextInput
        style={[{ marginTop: 40 }, styles.input]}
        placeholder="Kirjoita käyttäjänimi"
        value={userName}
        onChangeText={(text) => setUserName(text.toLowerCase())}
      />
      <TextInput
        style={styles.input}
        placeholder="Kirjoita salasana"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <View>
        {error ? <Error message={error} /> : null}
        <Button title="Kirjaudu" onPress={() => handleSubmit()} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.middleText}>Tarvitsetko tilin?</Text>
        <Button title="Rekisteröidy" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  container: {
    margin: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2196F3',
  },
  input: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonGroup: {
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  middleText: {
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default Login;


