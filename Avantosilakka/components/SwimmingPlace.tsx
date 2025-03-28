import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Pressable, Alert, Button, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import { saveComment } from '../services/swimmingplace';
import { sanitizeInput } from '../shared/Sanitize';

interface SwimmingPlaceProps {
  placeId: string | number | undefined;
}

const SwimmingPlace =  (props: SwimmingPlaceProps) => {
  const [placeComment, setPlaceComment] = useState('')
  const placeId = props.placeId

  const handleSave = async (comment) => {
    try {
      const savedComment = await saveComment(comment, placeId);
      Toast.show({
        type: 'success',
        text1: 'Comment saved successfully!',
      });
      console.log('Saved comment:', savedComment);
      return savedComment;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save comment.',
      });
      console.error('Error:', error);
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kirjoita halutessasi kommentti paikasta</Text>
      <TextInput
        style={styles.commentInput}
        placeholder='Kommentti'
        placeholderTextColor="#888"
        value={placeComment}
        onChangeText={(text) => setPlaceComment(sanitizeInput(text))}
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(placeComment)}>
        <Text style={styles.saveButtonText}>Tallenna kommentti</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    marginBottom: 20,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default SwimmingPlace;