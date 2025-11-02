import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]); // Nouvel état pour stocker les utilisateurs

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      console.log('📥 CHARGEMENT UTILISATEUR DEPUIS STORAGE...');
      const usersJSON = await AsyncStorage.getItem('users');
      const currentUserJSON = await AsyncStorage.getItem('currentUser');
      
      const loadedUsers = usersJSON ? JSON.parse(usersJSON) : [];
      const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
      
      console.log('📥 UTILISATEURS CHARGÉS:', loadedUsers.length);
      console.log('👤 UTILISATEUR ACTUEL:', currentUser ? currentUser.email : 'Aucun');
      
      setUsers(loadedUsers); // Mettre à jour l'état des utilisateurs
      setUser(currentUser);
    } catch (error) {
      console.error('❌ ERREUR CHARGEMENT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUsers = async (users) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('💾 UTILISATEURS SAUVEGARDÉS:', users.length);
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE USERS:', error);
      throw error;
    }
  };

  const saveCurrentUser = async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        console.log('💾 UTILISATEUR ACTUEL SAUVEGARDÉ:', user.email);
      } else {
        await AsyncStorage.removeItem('currentUser');
        console.log('🧹 UTILISATEUR ACTUEL SUPPRIMÉ');
      }
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE CURRENT USER:', error);
      throw error;
    }
  };

  const checkEmailExists = (email) => {
    // Utilise l'état `users` qui est mis à jour après le chargement
    return users.some(user => user.email === email);
  };

  const getUsers = async () => {
    try {
      const usersJSON = await AsyncStorage.getItem('users');
      return usersJSON ? JSON.parse(usersJSON) : [];
    } catch (error) {
      console.error('❌ ERREUR GET USERS:', error);
      return [];
    }
  };

  const register = async (email, password, prenom, nom, telephone = '') => {
    try {
      console.log('🚀 REGISTER - Début:', email);
      setIsLoading(true);

      // Charger les utilisateurs existants
      const existingUsers = await getUsers();
      console.log('📥 UTILISATEURS EXISTANTS:', existingUsers.length);

      // Vérifier si l'email existe déjà
      const emailExists = existingUsers.some(user => user.email === email);
      if (emailExists) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        prenom,
        nom,
        telephone,
        createdAt: new Date().toISOString(),
      };

      console.log('👤 NOUVEL USER:', newUser);

      // Sauvegarder le nouvel utilisateur
      const updatedUsers = [...existingUsers, newUser];
      await saveUsers(updatedUsers);
      setUsers(updatedUsers); // Mettre à jour l'état des utilisateurs
      
      // CRITIQUE : Définir comme utilisateur actuel et sauvegarder
      setUser(newUser);
      await saveCurrentUser(newUser);

      console.log('✅ UTILISATEUR AJOUTÉ:', email);
      console.log('✅ REGISTER RÉUSSI');
      console.log('🔄 AuthContext - User:', newUser.email);

      return newUser;
    } catch (error) {
      console.error('❌ ERREUR REGISTER:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 LOGIN - Tentative:', email);
      setIsLoading(true);

      const users = await getUsers();
      console.log('📥 UTILISATEURS CHARGÉS:', users.length);

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      console.log('✅ LOGIN RÉUSSI:', email);
      
      // CRITIQUE : Définir comme utilisateur actuel et sauvegarder
      setUser(user);
      await saveCurrentUser(user);

      return user;
    } catch (error) {
      console.error('❌ ERREUR LOGIN:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 LOGOUT - Déconnexion');
      setUser(null);
      await saveCurrentUser(null);
      console.log('✅ LOGOUT RÉUSSI');
    } catch (error) {
      console.error('❌ ERREUR LOGOUT:', error);
      throw error;
    }
  };

  const debugAuth = () => {
    console.log('🐛 DEBUG AUTH:');
    console.log('👤 User:', user);
    console.log('🔄 isLoading:', isLoading);
    console.log('📊 TOUS LES UTILISATEURS:', users.length);
    users.forEach(u => console.log('   -', u.email));
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    checkEmailExists,
    debugAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};