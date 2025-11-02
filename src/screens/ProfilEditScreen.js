// screens/ProfilEditScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig"; // Assurez-vous que firebaseConfig exporte storage
import { useAuth } from "../context/AuthContext";

export default function ProfilEditScreen() {
  const { user, updateUserProfile, updateUserAddress, loading } = useAuth();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState({ adresse: "", ville: "", codePostal: "" });
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && user.uid && user.uid !== "guest") {
      setPrenom(user.prenom || "");
      setNom(user.nom || "");
      setTelephone(user.telephone || "");
      setAdresse(user.adresse || { adresse: "", ville: "", codePostal: "" });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Nous avons besoin de l’accès aux photos pour changer l’avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.cancelled) {
      uploadAvatar(result.assets ? result.assets[0].uri : result.uri);
    }
  };

  const uploadAvatar = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setAvatar(url);
    } catch (err) {
      console.log("Erreur upload avatar:", err);
      Alert.alert("Erreur", "Impossible de télécharger la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !user.uid || user.uid === "guest") {
      Alert.alert("Erreur", "Impossible de sauvegarder vos informations. Vous n’êtes pas connecté.");
      return;
    }

    try {
      await updateUserProfile(user.uid, { prenom, nom, telephone, avatar });
      await updateUserAddress(user.uid, adresse);
      Alert.alert("Succès", "Vos informations ont été mises à jour !");
    } catch (error) {
      console.log("❌ Erreur mise à jour profil:", error);
      Alert.alert("Erreur", error.message || "Impossible de sauvegarder vos informations.");
    }
  };

  if (!user || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{prenom?.[0]?.toUpperCase() || "U"}</Text>
              </View>
            )}
            <Text style={styles.changeAvatarText}>{uploading ? "Téléchargement..." : "Changer la photo"}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Prénom</Text>
          <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} />

          <Text style={styles.label}>Nom</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />

          <Text style={styles.label}>Adresse</Text>
          <TextInput style={styles.input} placeholder="Rue" value={adresse.adresse} onChangeText={(text) => setAdresse({ ...adresse, adresse: text })} />

          <Text style={styles.label}>Ville</Text>
          <TextInput style={styles.input} placeholder="Ville" value={adresse.ville} onChangeText={(text) => setAdresse({ ...adresse, ville: text })} />

          <Text style={styles.label}>Code Postal</Text>
          <TextInput style={styles.input} placeholder="Code Postal" value={adresse.codePostal} onChangeText={(text) => setAdresse({ ...adresse, codePostal: text })} keyboardType="numeric" />

          <Button title="Sauvegarder" onPress={handleSave} disabled={loading || uploading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 15, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 5, borderRadius: 5 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#555" },
  changeAvatarText: { color: "#4c669f", fontWeight: "600" },
});
