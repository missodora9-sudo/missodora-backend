import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePanier } from '../context/PanierContext';
import { useCommandes } from '../context/CommandesContext';
import { useNavigation } from '@react-navigation/native';

export default function PanierScreen() {
  const { panier, total, viderPanier, incrementQuantity, decrementQuantity } = usePanier();
  const { ajouterCommande } = useCommandes();
  const navigation = useNavigation();

  // --- Créer la commande ---
  const handleCommander = () => {
    if (panier.length === 0) {
      Alert.alert('Votre panier est vide', 'Ajoutez des produits avant de commander.');
      return;
    }

    const nouvelleCommande = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      articles: panier,
      total,
      statut: 'En attente de paiement',
      adresseLivraison: {
        adresse: 'Non renseignée',
        codePostal: '',
        ville: '',
      },
    };

    ajouterCommande(nouvelleCommande);
    viderPanier();

    Alert.alert(
      'Commande enregistrée !',
      'Souhaitez-vous payer maintenant ou continuer vos achats ?',
      [
        {
          text: 'Continuer mes achats',
          onPress: () => navigation.navigate('Marques'),
          style: 'cancel',
        },
        {
          text: 'Payer maintenant',
          onPress: () => navigation.navigate('Paiement', { commande: nouvelleCommande }),
        },
      ],
      { cancelable: false }
    );
  };

  // --- Affichage d’un article ---
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.prix}>{item.prix.toFixed(2)} €</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => decrementQuantity(item.id)}>
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.qtyValue}>{item.quantite}</Text>

        <TouchableOpacity style={styles.qtyButton} onPress={() => incrementQuantity(item.id)}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>🛒 Mon Panier</Text>

      <FlatList
        data={panier}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.vide}>Votre panier est vide</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total : {total.toFixed(2)} €</Text>

        <TouchableOpacity
          style={[styles.commanderBtn, panier.length === 0 && { opacity: 0.6 }]}
          onPress={handleCommander}
          disabled={panier.length === 0}
        >
          <Text style={styles.commanderText}>Commander</Text>
        </TouchableOpacity>

        {/* 🔙 Bouton retour au catalogue (comme sur ProduitScreen) */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retourBtn}>
          <Text style={styles.retourText}>← Retour au catalogue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titre: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  nom: { fontSize: 16, color: '#333', fontWeight: '600' },
  prix: { fontSize: 14, color: '#2196F3', marginTop: 4 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  qtyText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  qtyValue: { marginHorizontal: 10, fontSize: 16, fontWeight: '600' },
  footer: { 
    marginTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#ddd', 
    paddingTop: 15,
    alignItems: 'center',
  },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 10, width: '100%' },
  commanderBtn: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  commanderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // --- Bouton retour simple, comme sur les autres écrans ---
  retourBtn: { marginTop: 20 },
  retourText: { 
    color: '#2196F3', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 16 
  },
  vide: { textAlign: 'center', color: '#666', marginTop: 40 },
});
