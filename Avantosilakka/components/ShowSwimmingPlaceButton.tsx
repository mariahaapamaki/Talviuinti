import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
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
      <Pressable style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Asetukset</Text>
      </Pressable>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={ownPlace ? 'checked' : 'unchecked'}
                onPress={() => handlePress('checkbox1')}
              />
              <Text>Omat paikat </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={allPlace ? 'checked' : 'unchecked'}
                onPress={() => handlePress('checkbox2')}
              />
              <Text>Kaikki paikat</Text>
            </View>
            <Pressable style={styles.button} onPress={() => setShowModal(false)}>
              <Text>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    color: 'white'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
  },
});

export default GetButton;


