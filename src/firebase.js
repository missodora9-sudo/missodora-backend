// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Configuration Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyD6q5cNyxqY0FeAmoj9PUJQzhkuBbuZu2o",
  authDomain: "missodora-c1ced.firebaseapp.com",
  projectId: "missodora-c1ced",
  storageBucket: "missodora-c1ced.appspot.com",
  messagingSenderId: "652011575809",
  appId: "1:652011575809:web:9e48df011b363f9741be00",
  measurementId: "G-M8G5DYBCL2"
};

// --- Initialisation Firebase App ---
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// --- Firestore ---
const db = getFirestore(app);

// --- Auth avec persistance React Native (sans Dynamic Links) ---
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  console.warn("⚠️ Firebase Auth est déjà initialisé :", e);
}

// --- Exemple de fonctions pour Email/Password ---
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

export { app, db, auth, registerWithEmail, loginWithEmail, logout };
