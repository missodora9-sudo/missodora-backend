import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function CommandesValideesFirebase() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'commandes'), where('statut', '==', 'Payée'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommandes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#4a7c59" style={{ marginTop: 50 }} />;

  if (!commandes.length) return (
    <View style={styles.container}>
      <Text style={styles.empty}>Aucune commande validée.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Commandes Payées</Text>
      <FlatList
        data={commandes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.client}>{item.utilisateur}</Text>
            <Text style={styles.detail}>Total : {item.totalTTC?.toFixed(2)} €</Text>
            <Text style={styles.detail}>Date : {new Date(item.datePaiement).toLocaleString('fr-FR')}</Text>
            <Text style={styles.detail}>Adresse : {item.adresseLivraison?.adresse}, {item.adresseLivraison?.ville}</Text>
            <Text style={styles.statut}>✅ {item.statut}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#2c5530' },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  client: { fontSize: 16, fontWeight: '600', color: '#333' },
  detail: { color: '#555', fontSize: 13 },
  statut: { marginTop: 8, fontWeight: 'bold', color: '#28a745' },
  empty: { textAlign: 'center', color: '#777', marginTop: 50, fontSize: 16 },
});
