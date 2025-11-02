// Fichier simple pour stocker les utilisateurs
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@app_users';

// Sauvegarder tous les utilisateurs
export const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    console.log('💾 UTILISATEURS SAUVEGARDÉS:', users.length);
    return true;
  } catch (error) {
    console.error('❌ ERREUR SAUVEGARDE:', error);
    return false;
  }
};

// Charger tous les utilisateurs
export const loadUsers = async () => {
  try {
    const storedUsers = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      console.log('📥 UTILISATEURS CHARGÉS:', users.length);
      return users;
    }
    console.log('📥 AUCUN UTILISATEUR TROUVÉ');
    return [];
  } catch (error) {
    console.error('❌ ERREUR CHARGEMENT:', error);
    return [];
  }
};

// Ajouter un utilisateur
export const addUser = async (newUser) => {
  try {
    const currentUsers = await loadUsers();
    
    // Vérifier si l'email existe déjà
    const emailExists = currentUsers.some(user => 
      user.email.toLowerCase() === newUser.email.toLowerCase()
    );
    
    if (emailExists) {
      throw new Error('Un compte avec cet email existe déjà');
    }
    
    const updatedUsers = [...currentUsers, newUser];
    await saveUsers(updatedUsers);
    
    console.log('✅ UTILISATEUR AJOUTÉ:', newUser.email);
    return newUser;
  } catch (error) {
    console.error('❌ ERREUR AJOUT:', error);
    throw error;
  }
};

// Trouver un utilisateur par email
export const findUserByEmail = async (email) => {
  try {
    const users = await loadUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('❌ ERREUR RECHERCHE:', error);
    return null;
  }
};

// Vérifier si un email existe
export const checkEmailExists = async (email) => {
  try {
    const users = await loadUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('❌ ERREUR VÉRIFICATION:', error);
    return false;
  }
};