import React, { useState, useRef, useEffect } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Animated, ActivityIndicator 
} from "react-native";

// --- Import des images locales ---
import item1Image from '../assets/images/chanel.png';
import item2Image from '../assets/images/bleu_chanel.png';
import item3Image from '../assets/images/lacoste.png';
import item4Image from '../assets/images/versace_eros.png';

const produitsInitiaux = [
  { id: "1", nom: "Item élégant 1", description: "Description de l’item 1", prix: 19.99, image: item1Image },
  { id: "2", nom: "Item élégant 2", description: "Description de l’item 2", prix: 29.99, image: item2Image },
  { id: "3", nom: "Item élégant 3", description: "Description de l’item 3", prix: 39.99, image: item3Image },
  { id: "4", nom: "Item élégant 4", description: "Description de l’item 4", prix: 49.99, image: item4Image },
];

export default function DiverseScreen({ navigation }) {
  const [produits, setProduits] = useState([]);
  const [recherche, setRecherche] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(true);

  // Simuler un appel API
  useEffect(() => {
    setTimeout(() => {
      setProduits(produitsInitiaux);
      setLoading(false);
    }, 800);
  }, []);

  const handleSearchChange = (text) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setRecherche(text);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Divers</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.rechercheInput}
        placeholder="🔍 Rechercher un produit..."
        value={recherche}
        onChangeText={handleSearchChange}
        clearButtonMode="while-editing"
      />

      {/* Liste animée des produits */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {produitsFiltres.length === 0 ? (
          <Text style={styles.noResult}>Aucun produit trouvé 😕</Text>
        ) : (
          <FlatList
            data={produitsFiltres}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.carte}
                onPress={() => navigation.navigate("Produit", { produit: item })}
              >
                <Image source={item.image} style={styles.image} />
                <Text style={styles.nom}>{item.nom}</Text>
                <Text style={styles.prix}>{item.prix.toFixed(2)} €</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  titre: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#333" },
  rechercheInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  carte: { 
    flex: 1, 
    margin: 10, 
    alignItems: "center",
    backgroundColor: "#fefefe",
    padding: 15,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 130, height: 130, borderRadius: 15, resizeMode: "contain" },
  nom: { marginTop: 10, fontSize: 16, fontWeight: "600", color: "#333", textAlign: "center" },
  prix: { fontSize: 14, fontWeight: "bold", color: "#4c669f", marginTop: 4 },
  noResult: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#4c669f' },
});
