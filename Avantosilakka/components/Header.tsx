import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const Header = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/download3.png')}
              style={styles.logo}
              contentFit="contain"
              contentPosition="center"
            />
            <Text style={styles.title}>Avantosilakka</Text>
          </View>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      safeArea: {
        backgroundColor: '#f3f4f6', 
      },
      headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start', 
        backgroundColor: 'skyblue',
        paddingVertical: 10,
        paddingHorizontal: 20, 
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2, 
        },    
      logo: {
        height: 60,
        width: 60,
        marginRight: 10,
        borderRadius: 50 ,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
    });
  
  export default Header;
  