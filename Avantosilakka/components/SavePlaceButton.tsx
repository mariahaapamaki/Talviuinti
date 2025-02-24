import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { saveUserPlace } from './api';

interface SavePlaceButtonProps {
  placeData: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

const SavePlaceButton: React.FC<SavePlaceButtonProps> = ({ placeData }) => {
  const handleSave = async () => {
    try {
      const result = await saveUserPlace(placeData);
      Alert.alert('Success', 'Place saved successfully!');
      console.log(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to save place.');
      console.error(error);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <Button title="Save Place" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
  },
});

export default SavePlaceButton;
