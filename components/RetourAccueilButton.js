import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RetourAccueilButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('Accueil')}>
      <Text style={styles.texte}>← Accueil</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bouton: {
    marginLeft: 10,
    backgroundColor: '#4c669f',
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
