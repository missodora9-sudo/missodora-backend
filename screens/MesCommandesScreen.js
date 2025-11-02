import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCommandes } from '../context/CommandesContext';
import { useNavigation } from '@react-navigation/native';

export default function MesCommandesScreen() {
  const { commandes, supprimerCommandes } = useCommandes();
  const navigation = useNavigation();
  const [selected, setSelected] = useState([]);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Payée': return '#28a745';
      case 'En attente de paiement': return '#ffc107';
      case 'Expédiée': return '#17a2b8';
      case 'Livrée': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === commandes.length) {
      setSelected([]);
    } else {
      setSelected(commandes.map((c) => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;

    Alert.alert(
      "Supprimer les commandes",
      `Voulez-vous vraiment supprimer ${selected.length} commande(s) sélectionnée(s) ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            supprimerCommandes(selected);
            setSelected([]);
          },
        },
      ]
    );
  };

  const handleSupprimer = (id) => {
    Alert.alert(
      "Supprimer la commande",
      "Voulez-vous vraiment supprimer cette commande ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => supprimerCommandes([id]) },
      ]
    );
  };

  const renderCommande = ({ item }) => {
    const handlePress = () => navigation.navigate('DetailCommande', { commande: item });
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.commandeItem, isSelected && styles.commandeSelected]}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleSelect(item.id)}>
          <Text style={styles.checkboxText}>{isSelected ? '☑️' : '⬜️'}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View style={styles.commandeHeader}>
            <Text style={styles.commandeId}>Commande #{item.id.slice(-6)}</Text>
            <Text style={styles.commandeDate}>
              {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          <View style={styles.commandeDetails}>
            <Text style={[styles.statut, { color: getStatusColor(item.statut) }]}>{item.statut}</Text>
            <Text style={styles.commandeTotal}>{item.total.toFixed(2)} €</Text>
          </View>

          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={styles.boutonSupprimer}
              onPress={() => handleSupprimer(item.id)}
            >
              <Text style={styles.boutonTexte}>🗑 Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const commandesTriees = [...commandes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Mes Commandes</Text>

      {commandes.length > 0 && (
        <TouchableOpacity style={styles.selectAllBtn} onPress={toggleAll}>
          <Text style={styles.selectAllText}>
            {selected.length === commandes.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={commandesTriees}
        keyExtractor={(item) => item.id}
        renderItem={renderCommande}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.vide}>Aucune commande trouvée</Text>}
      />

      {selected.length > 0 && (
        <TouchableOpacity style={styles.deleteSelectedBtn} onPress={handleDeleteSelected}>
          <Text style={styles.deleteSelectedText}>
            🗑 Supprimer la sélection ({selected.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Bouton retour simple */}
      <TouchableOpacity
        style={styles.retourBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.retourText}>← Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titre: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  commandeItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  commandeSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#2196F3',
  },
  checkbox: {
    marginRight: 10,
    justifyContent: 'center',
  },
  checkboxText: { fontSize: 22 },

  commandeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  commandeId: { fontSize: 16, fontWeight: 'bold' },
  commandeDate: { fontSize: 14, color: '#666' },
  commandeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statut: { fontSize: 14, fontWeight: 'bold' },
  commandeTotal: { fontSize: 16, fontWeight: 'bold', color: '#2196F3' },

  boutonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  boutonSupprimer: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
  },
  boutonTexte: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  selectAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  selectAllText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteSelectedBtn: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  vide: { textAlign: 'center', color: '#888', marginTop: 50 },

  retourBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
  },
  retourText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
