
import React, { useContext, useState, useCallback, useEffect } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../context/Auth.actions';
import axios from "axios"
import AuthGlobal from "../components/AuthGlobal"
import { logoutUser } from "../context/Auth.actions"

interface User {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
}

const UserProfile = (props) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
      const fetchUser = async () => {
        const user = await getCurrentUser();
        if (!user || !user.userId) {
          console.log('User is not logged in');
          return;
        }
        setUser(user as User);
      };
  
      fetchUser();
    }, []);
    const context = useContext(AuthGlobal)
    const handleLogout = async () => {
        await AsyncStorage.removeItem("jwt")
        logoutUser(context.dispatch)
    }

      return (
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{`${user?.firstName} ${user?.lastName}`}</Text>
            <Text style={styles.email}>{user?.userName}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Lisätiedot</Text>
            <Text style={styles.detail}>Sähköposti: </Text>
            <Text style={styles.detail}>Puhelinnumero: </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Muokkaa tietoja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => handleLogout()}>
            <Text style={styles.buttonText}>Kirjaudu ulos</Text>
            </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
      },
      profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#2196F3',
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
      },
      email: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
      },
      detailsContainer: {
        marginVertical: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 10,
      },
      detail: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
      },
      editButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    });
    
    export default UserProfile;