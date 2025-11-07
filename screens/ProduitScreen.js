import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { usePanier } from "../context/PanierContext";

export default function ProduitScreen({ route, navigation }) {
  const { ajouterAuPanier } = usePanier();

  // 🔹 Récupère le produit complet depuis VenteFlashScreen
  const produit = route?.params?.produit ?? {
    id: 0,
    nom: "Produit inconnu",
    description: "Pas de description disponible",
    prix: 0,
    image: require("../assets/MissOdoraLogo.png"),
  };

  const handleAddToCart = () => {
    ajouterAuPanier(produit);
    Alert.alert(
      "✅ Produit ajouté",
      `${produit.nom} a été ajouté à votre panier.`,
      [
        { text: "Continuer mes achats", style: "cancel" },
        { text: "Voir le panier 🛒", onPress: () => navigation.navigate("Panier") },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageWrapper}>
        <Image source={produit.image} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nom}>{produit.nom}</Text>
        <Text style={styles.desc}>{produit.description}</Text>
        <Text style={styles.prix}>{produit.prix.toFixed(2)} €</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.boutonPrincipal} onPress={handleAddToCart}>
            <Text style={styles.boutonTexte}>🛒 Ajouter au panier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonSecondaire} onPress={() => navigation.navigate("Panier")}>
            <Text style={styles.boutonTexteSecondaire}>Voir mon panier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
            <Text style={styles.boutonTexteRetour}>← Retour au catalogue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { alignItems: "center", padding: 20 },
  imageWrapper: {
    width: 260,
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    backgroundColor: "#fff",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  infoContainer: { width: "100%", alignItems: "center" },
  nom: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#333" },
  desc: { fontSize: 16, textAlign: "center", marginBottom: 15, lineHeight: 22, color: "#666" },
  prix: { fontSize: 24, fontWeight: "bold", color: "#27ae60", marginBottom: 25 },
  buttonsContainer: { width: "100%", gap: 12 },
  boutonPrincipal: { backgroundColor: "#28a745", padding: 18, borderRadius: 12, alignItems: "center", elevation: 3 },
  boutonSecondaire: { backgroundColor: "#007bff", padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#007bff" },
  boutonRetour: { padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  boutonTexte: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  boutonTexteSecondaire: { color: "#fff", fontSize: 16, fontWeight: "600" },
  boutonTexteRetour: { color: "#666", fontSize: 16 },
});
