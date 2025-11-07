import React, { useState, useRef } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Animated 
} from "react-native";

const marques = [
  { id: "1", nom: "Versace", image: require("../assets/images/parfum_a.png") },
  { id: "2", nom: "Dior", image: require("../assets/images/parfum_b.png") },
  { id: "3", nom: "Chanel", image: require("../assets/images/parfum_c.png") },
  { id: "4", nom: "Parfum Dubai", image: require("../assets/images/parfum_d.png") },
  { id: "5", nom: "Lacoste", image: require("../assets/images/parfum_e.png") },
  { id: "6", nom: "Hugo Boss", image: require("../assets/images/parfum_f.png") }
];

export default function MarquesScreen({ navigation }) {
  const [recherche, setRecherche] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const marquesFiltrees = marques.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  // Animation fade lors de la recherche
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

  return (
    <View style={styles.container}>
      {/* Titre simple */}
      <Text style={styles.titre}>Nos Marques</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.rechercheInput}
        placeholder="🔍 Rechercher une marque..."
        value={recherche}
        onChangeText={handleSearchChange}
        clearButtonMode="while-editing"
      />

      {/* Liste animée des marques */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {marquesFiltrees.length === 0 ? (
          <Text style={styles.noResult}>Aucune marque trouvée 😕</Text>
        ) : (
          <FlatList
            data={marquesFiltrees}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 30 }}
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
  noResult: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});
