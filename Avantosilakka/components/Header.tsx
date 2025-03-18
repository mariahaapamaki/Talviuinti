import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const Header = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <Image
              source={require('./download3.png')}
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
        backgroundColor: '#f3f4f6', // Match the header background
      },
      headerContainer: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically align items
        justifyContent: 'flex-start', // Align items to the left
        backgroundColor: 'skyblue', // Subtle gray background
        paddingVertical: 10,
        paddingHorizontal: 20, // Add some space from the left edge
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2, // Shadow for Android
        },    
      logo: {
        height: 60,
        width: 60,
        marginRight: 10,
        borderRadius: 50 , // Half of width and height to make it round
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
       // paddingHorizontal: 10,
      },
    });
  
  export default Header;
  