import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Error from '../shared/Error';
import { Image } from 'expo-image';
import axios from 'axios';
import { getBaseUrl } from '../components/api';
import Toast from 'react-native-toast-message'

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  UserProfile: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;

interface SignUpProps {
  navigation: SignUpScreenNavigationProp;
  //route: SignUpScreenRouteProp;
}

const SignUp = (props: SignUpProps) => {
  const { navigation } = props;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    let user = {
      userName: userName,
      password: password,
      firstName: firstName,
      lastName: lastName,
      isAdmin: false,
    };
    if (userName === '' || password === '' || firstName === '' || lastName === '') {
      setError('Täydennä kaikki kentät');
      return;
    }

    try {
      const res = await axios.post(`${getBaseUrl()}users/signup`, user);
      if (res.status === 200 || res.status === 201) {
        Toast.show({
            topOffset: 60,
            type: 'success',
            text1: "Rekisteröityminen onnistui",
            text2: "Voit kirjautua tilillesi"
        })
        setTimeout (() => {
            navigation.navigate('Login');
        },500)
      } else {
        setError('Registration failed');
      }
    } catch (err) {
        Toast.show({
            topOffset: 60,
            type: 'error',
            text1: "Jotain meni vikaan",
            text2: "Kokeile uudelleen"
        })
    }
  };

  return (
    <View
      //viewIsInsideTabBar={true}
      //extraHeight={200}
     // enableOnAndroid={true}
      style={styles.container}
    >
      <Image source={require('../components/download3.png')} style={styles.image} />
      <Text style={styles.header}>Rekisteröidy Avantosilakkaan</Text>
      <TextInput
        style={[{ marginTop: 40 }, styles.input]}
        placeholder="Käyttäjänimi"
        value={userName}
        onChangeText={(text) => setUserName(text.toLowerCase())}
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Etunimi"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sukunimi"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <View>
        {error ? <Error message={error} /> : null}
      </View>
      <View>
        <Button title="Tallenna" onPress={handleSubmit} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button title="Takaisin kirjautumiseen" onPress={() => navigation.navigate('Login')} />
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

export default SignUp;

