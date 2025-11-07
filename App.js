import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { PanierProvider, usePanier } from './context/PanierContext';
import { CommandesProvider, useCommandes } from './context/CommandesContext';
import CommandesResetWatcher from './context/CommandesResetWatcher';

// Screens
import BienvenueScreen from './screens/BienvenueScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import MarquesScreen from './screens/MarquesScreen';
import CatalogueScreen from './screens/CatalogueScreen';
import PanierScreen from './screens/PanierScreen';
import PaiementScreen from './screens/PaiementScreen';
import MesCommandesScreen from './screens/MesCommandesScreen';
import ProduitScreen from './screens/ProduitScreen';
import DetailCommandeScreen from './screens/DetailCommandeScreen';
import CloneCatalogueScreen from './screens/CloneCatalogueScreen';
import ProfilEditScreen from './screens/ProfilEditScreen';
import VenteFlashScreen from './screens/VenteFlashScreen';
import DiverseScreen from './screens/DiverseScreen';
import AccueilScreen from './screens/AccueilScreen';

// Components
import RetourAccueilButton from './components/RetourAccueilButton';

const Stack = createNativeStackNavigator();

// --- Header Icons ---
function HeaderIcons({ navigation }) {
  const { getCommandesEnAttente } = useCommandes();
  const { panier } = usePanier();

  const commandesEnAttente = getCommandesEnAttente();
  const totalArticlesPanier = panier.reduce((total, item) => total + (item.quantite || 1), 0);

  return (
    <View style={styles.headerIconsContainer}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('VenteFlash')}>
        <Text style={styles.iconText}>⚡</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Diverse')}>
        <Text style={styles.iconText}>🛍</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('MesCommandes')}>
        <Text style={styles.iconText}>📦</Text>
        {commandesEnAttente.length > 0 && (
          <View style={[styles.badge, styles.badgeCommandes]}>
            <Text style={styles.badgeText}>{commandesEnAttente.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Panier')}>
        <Text style={styles.iconText}>🛒</Text>
        {totalArticlesPanier > 0 && (
          <View style={[styles.badge, styles.badgePanier]}>
            <Text style={styles.badgeText}>
              {totalArticlesPanier > 99 ? '99+' : totalArticlesPanier}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// --- Auth Stack ---
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bienvenue" component={BienvenueScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Inscription' }} />
    </Stack.Navigator>
  );
}

// --- App Stack ---
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Accueil"
        component={AccueilScreen}
        options={({ navigation }) => ({
          title: 'Accueil',
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Marques"
        component={MarquesScreen}
        options={({ navigation }) => ({
          title: 'Nos Marques',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Catalogue"
        component={CatalogueScreen}
        options={({ navigation }) => ({
          title: 'Catalogue',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="VenteFlash"
        component={VenteFlashScreen}
        options={({ navigation }) => ({
          title: 'Vente Flash',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Diverse"
        component={DiverseScreen}
        options={({ navigation }) => ({
          title: 'Divers',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Panier"
        component={PanierScreen}
        options={({ navigation }) => ({
          title: 'Mon Panier',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Paiement"
        component={PaiementScreen}
        options={({ navigation }) => ({
          title: 'Paiement Sécurisé',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="MesCommandes"
        component={MesCommandesScreen}
        options={({ navigation }) => ({
          title: 'Mes Commandes',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Produit"
        component={ProduitScreen}
        options={({ navigation }) => ({
          title: 'Détails du produit',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="DetailCommande"
        component={DetailCommandeScreen}
        options={({ navigation }) => ({
          title: 'Détail de commande',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="CloneCatalogue"
        component={CloneCatalogueScreen}
        options={({ navigation }) => ({
          title: 'Catalogue',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Profil"
        component={ProfilEditScreen}
        options={({ navigation }) => ({
          title: 'Mon Profil',
          headerLeft: () => <RetourAccueilButton navigation={navigation} />,
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />

      {/* 🔹 Ajout de Register ici pour permettre navigation depuis Panier */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Créer un compte' }}
      />
    </Stack.Navigator>
  );
}

// --- Root Navigator ---
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

// --- App Content ---
function AppContent() {
  const { user } = useAuth();

  return (
    <PanierProvider>
      <CommandesProvider>
        <CommandesResetWatcher />
        <NavigationContainer key={user ? user.uid : 'guest'}>
          <RootNavigator />
        </NavigationContainer>
      </CommandesProvider>
    </PanierProvider>
  );
}

// --- App Principal ---
export default function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51SOP501JwFGcWQXFtRhOaIAYtPML7a7lZ7p4BlVMaTDvqxoeArEzbNqqTNWIrzR1c6voRNaYha3Z7gH984hb9C2K00uSLVTfL5"
      merchantIdentifier="merchant.com.missodora"
      urlScheme="missodora"
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </StripeProvider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  icon: { marginLeft: 15, position: 'relative', padding: 8 },
  iconText: { fontSize: 20 },
  badge: { position: 'absolute', top: -5, right: -5, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  badgeCommandes: { backgroundColor: '#ff9500' },
  badgePanier: { backgroundColor: '#ff3b30' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  retourButton: { marginLeft: 10, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, elevation: 2 },
  retourText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#4c669f' },
});
