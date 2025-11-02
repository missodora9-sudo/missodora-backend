import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

const marques = [
  { id: "1", nom: "Versace", image: require("../assets/images/parfum_a.png") },
  { id: "2", nom: "Dior", image: require("../assets/images/parfum_b.png") },
  { id: "3", nom: "Chanel", image: require("../assets/images/parfum_c.png") },
  { id: "4", nom: "Parfum Dubai", image: require("../assets/images/parfum_d.png") },
  { id: "5", nom: "Lacoste", image: require("../assets/images/parfum_e.png") },
  { id: "6", nom: "Hugo Boss", image: require("../assets/images/parfum_f.png") }
];

export default function MarquesScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log("🚪 Déconnexion depuis MarquesScreen");
    logout();
  };

  return (
    <View style={styles.container}>
      {/* En-tête avec roue dentée conditionnelle, bienvenue et bouton déconnexion */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <View style={styles.bienvenueRow}>
            {/* Afficher la roue dentée seulement si l'utilisateur n'est pas invité */}
            {user && !user.isGuest && (
              <TouchableOpacity 
                style={styles.settingsButton} 
                onPress={() => navigation.navigate('Profil')} // écran Profil
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.bienvenue}>Bonjour {user?.prenom || 'invité'} ! 👋</Text>
          </View>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>
        
        {/* Bouton Déconnexion */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titre}>Nos Marques</Text>
      
      <FlatList
        data={marques}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carte}
            onPress={() => navigation.navigate("Catalogue", { marque: item.nom })}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.nom}>{item.nom}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 10 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  welcomeContainer: {
    flex: 1,
  },
  bienvenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 8, // espace entre la roue dentée et le texte
  },
  settingsIcon: {
    fontSize: 20,
  },
  bienvenue: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333"
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  titre: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginVertical: 20,
    color: "#333"
  },
  carte: { 
    flex: 1, 
    margin: 10, 
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: { 
    width: 120, 
    height: 120, 
    borderRadius: 10,
    resizeMode: "contain"
  },
  nom: { 
    marginTop: 10, 
    fontSize: 16, 
    fontWeight: "600",
    color: "#333",
    textAlign: "center"
  },
});
