// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// --- Configuration Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyD6q5cNyxqY0FeAmoj9PUJQzhkuBbuZu2o",
  authDomain: "missodora-c1ced.firebaseapp.com",
  projectId: "missodora-c1ced",
  storageBucket: "missodora-c1ced.appspot.com",
  messagingSenderId: "652011575809",
  appId: "1:652011575809:web:9e48df011b363f9741be00",
  measurementId: "G-M8G5DYBCL2",
};

// --- Initialisation de l'app ---
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Initialisation Auth avec persistance ---
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// --- Firestore ---
const db = getFirestore(app);

export { app, auth, db };
