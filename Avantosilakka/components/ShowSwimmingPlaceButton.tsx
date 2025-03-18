import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface GetButtonProps {
  onCheckboxChange: (name: string, value: boolean) => void;
}

const GetButton = ({ onCheckboxChange }: GetButtonProps) => {
  const [ownPlace, setOwnPlace] = useState(true);
  const [allPlace, setAllPlace] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handlePress = (name: 'checkbox1' | 'checkbox2') => {
    if (name === 'checkbox1') {
      const newChecked = !ownPlace;
      setOwnPlace(newChecked);
      onCheckboxChange(name, newChecked);
    } else if (name === 'checkbox2') {
      const newChecked = !allPlace;
      setAllPlace(newChecked);
      onCheckboxChange(name, newChecked);
    }
  };

  return (
    <View>
      <View style={styles.buttonT}>
        <Button title="Asetukset" onPress={() => setShowModal(true)} />
      </View>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={ownPlace ? 'checked' : 'unchecked'}
                onPress={() => handlePress('checkbox1')}
              />
              <Text style={styles.checkboxLabel}>Omat paikat</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={allPlace ? 'checked' : 'unchecked'}
                onPress={() => handlePress('checkbox2')}
              />
              <Text style={styles.checkboxLabel}>Yleiset uintipaikat</Text>
            </View>
            <Button title="Sulje" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-start', // Align items to the start
    width: '100%', // Ensure the container takes full width
    paddingHorizontal: 20, // Add padding to align with other elements
  },
  checkboxLabel: {
    marginLeft: 8, // Add margin to the left of the label to align with the checkbox
  },
  button: {
    backgroundColor: '#d9ffb3', // Light grey background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border color
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for a modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonT: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%', // Ensure the modal view takes a specific width
  },
});

export default GetButton;


