import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { usePanier } from "../context/PanierContext";

// Données des produits avec descriptions multi-lignes
const produitsParMarque = {
  "Chanel": [
    { 
      id: 1, 
      nom: "Chanel N°5", 
      prix: 89.90, 
      description: `Parfum emblématique et intemporel, alliant notes florales et poudrées. Une signature élégante pour la femme sophistiquée.`, 
      image: require("../assets/images/parfum_c.png") 
    },
    { 
      id: 2, 
      nom: "Coco Mademoiselle", 
      prix: 95.50, 
      description: `Fragrance fraîche et audacieuse, un mélange de notes d'agrumes et de fleurs blanches pour un charme irrésistible.`, 
      image: require("../assets/images/parfum_c.png") 
    },
  ],
  "Dior": [
    { 
      id: 3, 
      nom: "J'adore", 
      prix: 92.00, 
      description: `Parfum luxueux aux notes florales et fruitées, sensuel et sophistiqué.`, 
      image: require("../assets/images/parfum_b.png") 
    },
    { 
      id: 4, 
      nom: "Sauvage", 
      prix: 87.50, 
      description: `Une fragrance sauvage et masculine, intense et irrésistible.`, 
      image: require("../assets/images/parfum_b.png") 
    },
    { 
      id: 7, 
      nom: "Miss Dior", 
      prix: 92.50, 
      description: `En 1947, Miss Dior est née de cet élan fou, de ce désir impérieux de réenchanter la vie des femmes, de leur redonner à voir les couleurs chatoyantes de l’amour.
Rose de Grasse, Muguet et Jasmin se combinent pour former des bouquets floraux inoubliables. Des fleurs comme promesse de bonheur.`, 
      image: require("../assets/images/parfum_g.png") 
    },
  ],
  "Versace": [
    { 
      id: 5, 
      nom: "Bright Crystal", 
      prix: 78.00, 
      description: `Radieux et sensuel comme le cristal 
	   Versace Bright Crystal est taillé comme un diamant précieux et est défini par des accords rafraîchissants et floraux.
	   De délicieuses graines de grenade et des accords frais donnent le ton à ce parfum. 
	   Un bouquet de fleurs de rose, de magnolia et de lotus constitue le centre de la composition.
	   Les notes boisées et l'ambre apportent une conclusion sensuelle.`, 
      image: require("../assets/images/parfum_h.png") 
    },
    { 
      id: 6, 
      nom: "Eros", 
      prix: 82.00, 
      description: `Parfum intense et passionné pour homme, mariant menthe, pomme verte et vanille pour un charme irrésistible.`, 
      image: require("../assets/images/parfum_a.png") 
    },
  ],
  "Parfum Dubai": [
    { 
      id: 8, 
      nom: "Dubai Oud", 
      prix: 65.00, 
      description: `Une fragrance orientale envoûtante avec des notes boisées et épicées, symbole du luxe et de l'exotisme.`, 
      image: require("../assets/images/parfum_d.png") 
    },
  ],
  "Lacoste": [
    { 
      id: 9, 
      nom: "Lacoste Essential", 
      prix: 55.00, 
      description: `Fraîcheur dynamique et sportive, avec des notes vertes et citronnées pour un parfum lumineux et masculin.`, 
      image: require("../assets/images/parfum_e.png") 
    },
  ],
  "Hugo Boss": [
    { 
      id: 10, 
      nom: "Boss Bottled", 
      prix: 72.00, 
      description: `Élégance et sophistication moderne, un mélange de bois, de pomme et d’épices qui séduit les hommes confiants.`, 
      image: require("../assets/images/parfum_f.png") 
    },
  ]
};

export default function CatalogueScreen({ route, navigation }) {
  const { marque } = route.params || {};
  const { ajouterAuPanier } = usePanier();

  const marqueSelectionnee = marque || "Marque inconnue";
  const produits = produitsParMarque[marque] || [];

  const handleAjouterPanier = (produit) => {
    ajouterAuPanier(produit);
    alert(`✅ ${produit.nom} ajouté au panier !`);
  };

  if (produits.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Catalogue {marqueSelectionnee}</Text>
        <Text style={styles.aucunProduit}>Aucun produit disponible pour {marqueSelectionnee}</Text>
        <TouchableOpacity 
          style={styles.boutonRetour}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.boutonRetourTexte}>← Retour aux marques</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Catalogue {marqueSelectionnee}</Text>
      
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.produitCarte}
            onPress={() => navigation.navigate("Produit", { produit: item })}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text style={styles.prix}>{item.prix.toFixed(2)} €</Text>
            </View>
            <TouchableOpacity 
              style={styles.boutonAjouter}
              onPress={() => handleAjouterPanier(item)}
            >
              <Text style={styles.boutonTexte}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.boutonRetour}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.boutonRetourTexte}>← Retour aux marques</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  titre: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#333" },
  aucunProduit: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 50, marginBottom: 20 },
  produitCarte: { flexDirection: "row", backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  image: { width: 60, height: 60, borderRadius: 8, resizeMode: "contain" },
  info: { flex: 1, marginLeft: 15 },
  nom: { fontSize: 16, fontWeight: "600", color: "#333" },
  prix: { fontSize: 16, fontWeight: "bold", color: "#2196F3", marginTop: 5 },
  boutonAjouter: { backgroundColor: "#28a745", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  boutonTexte: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  boutonRetour: { padding: 15, alignItems: "center", marginTop: 10, marginBottom: 10 },
  boutonRetourTexte: { color: "#666", fontSize: 16, fontWeight: "600" },
});
