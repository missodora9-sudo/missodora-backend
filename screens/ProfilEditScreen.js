// screens/ProfilEditScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function ProfilEditScreen() {
  const { user, updateUserProfile, loading } = useAuth();
  const scrollViewRef = useRef();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [avatar, setAvatar] = useState(null);

  // Charger les données utilisateur dès que user est défini
  useEffect(() => {
    if (!loading && user && user.uid && user.uid !== 'guest') {
      setPrenom(user.prenom || '');
      setNom(user.nom || '');
      setTelephone(user.telephone || '');
      setAdresse(user.adresse?.adresse || '');
      setVille(user.adresse?.ville || '');
      setCodePostal(user.adresse?.codePostal || '');
      setAvatar(user.avatar || null);
    }
  }, [loading, user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de l’accès aux photos pour changer l’avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setAvatar(result.assets ? result.assets[0].uri : result.uri);
    }
  };

  const handleSave = async () => {
    if (!user || !user.uid || user.uid === 'guest') {
      Alert.alert('Erreur', 'Impossible de sauvegarder vos informations. Vous n’êtes pas connecté.');
      return;
    }

    const newData = {
      prenom,
      nom,
      telephone,
      avatar,
      adresse: {
        adresse,
        ville,
        codePostal,
      },
    };

    try {
      await updateUserProfile(user.uid, newData);
      Alert.alert('Profil mis à jour', 'Vos informations ont été sauvegardées.');
    } catch (err) {
      console.log('Erreur updateUserProfile:', err);
      Alert.alert('Erreur', 'Impossible de sauvegarder vos informations.');
    }
  };

  if (loading || !user) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#FF6B8B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Modifier mon profil</Text>

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{prenom?.[0]?.toUpperCase() || 'U'}</Text>
            </View>
          )}
          <Text style={styles.changeAvatarText}>Changer la photo</Text>
        </TouchableOpacity>

        {/** Champs utilisateur **/}
        {[
          { label: 'Prénom', value: prenom, setter: setPrenom, placeholder: 'Prénom' },
          { label: 'Nom', value: nom, setter: setNom, placeholder: 'Nom' },
          { label: 'Téléphone', value: telephone, setter: setTelephone, placeholder: 'Téléphone', keyboardType: 'phone-pad' },
          { label: 'Adresse', value: adresse, setter: setAdresse, placeholder: 'Adresse' },
          { label: 'Ville', value: ville, setter: setVille, placeholder: 'Ville' },
          { label: 'Code postal', value: codePostal, setter: setCodePostal, placeholder: 'Code postal', keyboardType: 'number-pad' },
        ].map((field, index) => (
          <View style={styles.card} key={index}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.setter}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType || 'default'}
              onFocus={() => {
                scrollViewRef.current?.scrollTo({ y: index * 80, animated: true });
              }}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#f9f9f9', 
    paddingBottom: 40,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    textAlign: 'center', 
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#ddd', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#555',
  },
  changeAvatarText: {
    color: '#FF6B8B', 
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width:0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    borderRadius: 10, 
    fontSize: 16, 
    backgroundColor: '#fdfdfd',
  },
  button: { 
    backgroundColor:'#FF6B8B', 
    padding:15, 
    borderRadius:12, 
    alignItems:'center',
    marginTop:10,
    shadowColor: '#FF6B8B',
    shadowOffset: { width:0, height:5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { 
    color:'#fff', 
    fontWeight:'bold', 
    fontSize:18,
  },
});
