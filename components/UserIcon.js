import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function UserIcon() {
  const { user } = useAuth();
  const navigation = useNavigation();

  // Ne rien afficher si l'utilisateur est invité ou inexistant
  if (!user || user.isGuest) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('Profil')}
    >
      <Text style={styles.text}>{user.prenom}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginLeft: 15, padding: 8, backgroundColor: '#eee', borderRadius: 10 },
  text: { fontSize: 16, fontWeight: 'bold', color: '#333' },
});
