import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function DetailCommandeScreen({ route }) {
  const { commande } = route.params;
  const navigation = useNavigation();
  const { user } = useAuth();

  // Fonction pour obtenir l'adresse de livraison
  const getAdresseLivraison = () => {
    if (commande.statut === 'En attente de paiement') {
      if (user) {
        if (user.adresse && typeof user.adresse === 'object') return user.adresse;
        if (user.adresseLivraison) return user.adresseLivraison;
        if (user.address) return user.address;
        if (user.rue || user.ville || user.codePostal) {
          return {
            adresse: user.rue || '',
            ville: user.ville || '',
            codePostal: user.codePostal || ''
          };
        }
      }
      if (commande.adresseLivraison) return commande.adresseLivraison;
    } else {
      if (commande.adresseLivraison) return commande.adresseLivraison;
      if (user?.adresse) return user.adresse;
    }
    return { adresse: 'Adresse non renseignée', ville: '', codePostal: '' };
  };

  const adresseLivraison = getAdresseLivraison();

  const formatAdresse = (adresse) => {
    if (!adresse) return 'Adresse non renseignée';
    if (typeof adresse === 'string') return adresse;

    const rue = adresse.adresse || adresse.rue || adresse.address || '';
    const ville = adresse.ville || adresse.city || '';
    const codePostal = adresse.codePostal || adresse.code_postal || adresse.postalCode || '';

    if (rue && ville && codePostal) return `${rue}\n${codePostal} ${ville}`;
    if (rue) return rue;
    if (ville || codePostal) return `${codePostal} ${ville}`.trim();
    return 'Adresse non renseignée';
  };

  const renderArticle = ({ item }) => (
    <View style={styles.articleItem}>
      <Text style={styles.articleNom}>{item.nom}</Text>
      <View style={styles.articleDetails}>
        <Text style={styles.articleQuantite}>Quantité: {item.quantite}</Text>
        <Text style={styles.articlePrix}>{item.prix?.toFixed(2)} €</Text>
      </View>
    </View>
  );

  const handlePayer = () => {
    navigation.navigate('Paiement', { commande });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Détail de la commande</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Informations de la commande</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Numéro de commande:</Text>
          <Text style={styles.infoValue}>#{commande.id?.slice(-6) || commande._id?.slice(-6) || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>
            {new Date(commande.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Statut:</Text>
          <Text style={[
            styles.infoValue,
            styles.statut,
            commande.statut === 'En attente de paiement' && styles.statutAttente,
            commande.statut === 'Payé' && styles.statutPaye,
            commande.statut === 'Livré' && styles.statutLivre
          ]}>
            {commande.statut}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Articles commandés</Text>
        <FlatList
          data={commande.articles}
          renderItem={renderArticle}
          keyExtractor={(item, index) =>
            item.cartItemId ? item.cartItemId.toString() :
            item.id ? item.id.toString() :
            index.toString()
          }
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Adresse de livraison</Text>
        <Text style={styles.adresse}>{formatAdresse(adresseLivraison)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Total</Text>
        <Text style={styles.total}>{commande.total?.toFixed(2)} €</Text>
      </View>

      {commande.statut === 'En attente de paiement' && (
        <TouchableOpacity style={styles.bouton} onPress={handlePayer}>
          <Text style={styles.boutonTexte}>Payer maintenant</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.retourBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.retourText}>← Retour à mes commandes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titre: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  section: { 
    backgroundColor: '#f9f9f9', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3 
  },
  sectionTitre: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  statut: { fontWeight: 'bold' },
  statutAttente: { color: '#ff9800' },
  statutPaye: { color: '#4caf50' },
  statutLivre: { color: '#2196f3' },
  articleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  articleNom: { fontSize: 14, color: '#333', flex: 2 },
  articleDetails: { flex: 1, alignItems: 'flex-end' },
  articleQuantite: { fontSize: 12, color: '#666' },
  articlePrix: { fontSize: 14, fontWeight: '500', color: '#333' },
  adresse: { fontSize: 14, color: '#666', lineHeight: 20, backgroundColor: '#fff', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#eee' },
  total: { fontSize: 20, fontWeight: 'bold', color: '#2196F3', textAlign: 'right' },
  bouton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  boutonTexte: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  retourBtn: { marginTop: 10, marginBottom: 40 },
  retourText: { color: '#2196F3', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});
