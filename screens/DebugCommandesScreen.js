// screens/DebugCommandesScreen.js
import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  Button 
} from "react-native";
import { useCommandes } from "../context/CommandesContext";

export default function DebugCommandesScreen({ navigation }) {
  const { commandes, ajouterCommande } = useCommandes();

  console.log("=== DEBUG COMMANDES ===");
  console.log("Nombre de commandes:", commandes.length);
  console.log("Commandes:", commandes);

  // Fonction pour ajouter des données de test
  const ajouterDonneesTest = () => {
    if (commandes.length === 0) {
      console.log("Ajout de commandes de test...");
      
      // Commande 1 - Payée
      ajouterCommande([
        { id: 1, nom: "Parfum Fleur", prix: 45.90, quantite: 1 },
        { id: 2, nom: "Crème Hydratante", prix: 32.50, quantite: 2 }
      ]);
      
      // Commande 2 - En attente
      ajouterCommande([
        { id: 3, nom: "Huile Essentielle", prix: 28.00, quantite: 1 }
      ]);
      
      console.log("Commandes de test ajoutées");
    }
  };

  // Test de boutons en dehors de la FlatList
  const TestButtons = () => (
    <View style={styles.testSection}>
      <Text style={styles.debugTitle}>TEST BOUTONS HORS FLATLIST</Text>
      
      {/* Test 1: TouchableOpacity simple */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => Alert.alert('Test 1', 'TouchableOpacity fonctionne!')}
      >
        <Text style={styles.testButtonText}>TouchableOpacity Test</Text>
      </TouchableOpacity>

      {/* Test 2: Button natif */}
      <Button 
        title="Button Natif Test" 
        onPress={() => Alert.alert('Test 2', 'Button natif fonctionne!')} 
      />

      {/* Test 3: TouchableOpacity avec bordure */}
      <TouchableOpacity 
        style={[styles.testButton, { borderWidth: 5, borderColor: 'yellow' }]}
        onPress={() => Alert.alert('Test 3', 'Bouton bordure fonctionne!')}
      >
        <Text style={styles.testButtonText}>Bouton Bordure</Text>
      </TouchableOpacity>

      {/* Bouton pour ajouter manuellement des données de test */}
      <TouchableOpacity 
        style={[styles.testButton, { backgroundColor: 'green' }]}
        onPress={ajouterDonneesTest}
      >
        <Text style={styles.testButtonText}>➕ Ajouter Commandes Test</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => {
    console.log(`Rendering item ${index}:`, item);
    
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Commande: {item.id}</Text>
        <Text style={styles.itemText}>État: {item.etat}</Text>
        <Text style={styles.itemText}>Produits: {item.produits?.length || 0}</Text>
        
        {/* Test de bouton DANS la FlatList */}
        <View style={styles.buttonTest}>
          <Text style={styles.debugText}>Avant le bouton</Text>
          
          <TouchableOpacity 
            style={[styles.detailButton, { borderWidth: 3, borderColor: 'red' }]}
            onPress={() => {
              console.log(`Bouton cliqué pour commande ${item.id}`);
              Alert.alert('Debug', `Commande ${item.id} cliquée!`);
              navigation.navigate("DetailCommande", { commandeId: item.id });
            }}
          >
            <Text style={styles.detailButtonText}>[ BOUTON DÉTAILS ]</Text>
          </TouchableOpacity>
          
          <Text style={styles.debugText}>Après le bouton</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TestButtons />
      
      <Text style={styles.sectionTitle}>
        LISTE DES COMMANDES: {commandes.length} commande(s)
      </Text>
      
      <FlatList
        data={commandes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View>
            <Text style={styles.emptyText}>Aucune commande disponible</Text>
            <Text style={styles.emptySubText}>
              Cliquez sur "Ajouter Commandes Test" ci-dessus
            </Text>
          </View>
        }
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'lightblue'
  },
  testSection: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'green'
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 10
  },
  testButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center'
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'darkblue'
  },
  itemContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'orange'
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5
  },
  buttonTest: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  debugText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center'
  },
  detailButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5
  },
  detailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: 'gray'
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'darkgray',
    marginTop: 10
  },
  flatList: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 5
  }
});