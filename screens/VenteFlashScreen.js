import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- Import des images locales ---
import robeImage from '../assets/images/chanel_no5.png';
import sacImage from '../assets/images/dubai.png';
import sandalesImage from '../assets/images/my_way.png';
import chemisierImage from '../assets/images/twin.png';

// --- Écran Vente Flash ---
export default function VenteFlashScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 1h de promo simulée

  useEffect(() => {
    setTimeout(() => {
      setProduits([
        {
          id: '1',
          nom: 'Robe d’été élégante',
          prix: 29.99,
          ancienPrix: 59.99,
          description: 'Une robe légère et élégante pour toutes les occasions.',
          image: robeImage,
        },
        {
          id: '2',
          nom: 'Sac en cuir premium',
          prix: 49.99,
          ancienPrix: 99.99,
          description: 'Sac en cuir de qualité supérieure pour un style raffiné.',
          image: sacImage,
        },
        {
          id: '3',
          nom: 'Sandales chic',
          prix: 19.99,
          ancienPrix: 39.99,
          description: 'Sandales confortables et élégantes pour l’été.',
          image: sandalesImage,
        },
        {
          id: '4',
          nom: 'Chemisier fleuri',
          prix: 24.99,
          ancienPrix: 49.99,
          description: 'Chemisier léger avec un motif floral tendance.',
          image: chemisierImage,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
        <Text style={styles.loadingText}>Chargement des ventes flash...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#e6ecff']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>🔥 Vente Flash du Jour 🔥</Text>
        <Text style={styles.timer}>⏰ Se termine dans {formatTime(timeLeft)}</Text>
      </View>

      <FlatList
        data={produits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.nom}>{item.nom}</Text>

            <View style={styles.prixContainer}>
              <Text style={styles.prixPromo}>{item.prix.toFixed(2)} €</Text>
              <Text style={styles.ancienPrix}>{item.ancienPrix.toFixed(2)} €</Text>
            </View>

            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.bouton}>
              <TouchableOpacity onPress={() => navigation.navigate('Produit', { produit: item })}>
                <Text style={styles.boutonTexte}>Voir le produit</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 15 },
  header: { alignItems: 'center', marginBottom: 10 },
  titre: { fontSize: 22, fontWeight: 'bold', color: '#192f6a', marginBottom: 4 },
  timer: { fontSize: 14, color: '#ff3b30', fontWeight: 'bold' },
  liste: { paddingHorizontal: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', elevation: 3 },
  image: { width: 160, height: 160, borderRadius: 12 },
  nom: { fontSize: 16, fontWeight: '600', marginTop: 10, color: '#333', textAlign: 'center' },
  prixContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  prixPromo: { fontSize: 16, color: '#4c669f', fontWeight: 'bold', marginRight: 8 },
  ancienPrix: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  bouton: { marginTop: 10, borderRadius: 25, paddingVertical: 6, paddingHorizontal: 20 },
  boutonTexte: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#4c669f' },
});
