import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RetourMarquesButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('Marques')}>
      <Text style={styles.texte}>← Marques</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bouton: {
    marginLeft: 10,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  texte: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
