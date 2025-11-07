// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../src/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.log("⚠️ Firebase Auth n'est pas initialisé !");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (user?.isGuest) {
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() });
          } else {
            const names = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : ["", ""];
            const newUser = {
              email: firebaseUser.email,
              prenom: names[0] || "",
              nom: names[1] || "",
              telephone: "",
              adresse: { adresse: "", ville: "", codePostal: "" },
              avatar: null,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
            setUser({ uid: firebaseUser.uid, ...newUser });
          }
          setIsGuest(false);
        } catch (error) {
          console.log("Erreur récupération utilisateur:", error);
          setUser(null);
        }
      } else {
        if (!user?.isGuest) {
          setUser(null);
          setIsGuest(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.isGuest]);

  const register = async (email, password, prenom, nom, telephone, adresseObj) => {
    if (!auth) throw new Error("Firebase Auth n'est pas initialisé !");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: `${prenom} ${nom}` });

      const newUser = {
        email,
        prenom,
        nom,
        telephone,
        adresse: adresseObj || { adresse: "", ville: "", codePostal: "" },
        avatar: null,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", cred.user.uid), newUser);
      setUser({ uid: cred.user.uid, ...newUser });
      setIsGuest(false);
      return { success: true, user: { uid: cred.user.uid, ...newUser } };
    } catch (error) {
      console.log("Erreur inscription:", error);
      throw new Error("Impossible de créer le compte.");
    }
  };

  const login = async (email, password) => {
    if (!auth) throw new Error("Firebase Auth n'est pas initialisé !");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (userDoc.exists()) {
        setUser({ uid: cred.user.uid, ...userDoc.data() });
      }
      setIsGuest(false);
      return { success: true, user: { uid: cred.user.uid, ...userDoc.data() } };
    } catch (error) {
      console.log("Erreur connexion:", error);
      throw new Error("Impossible de se connecter. Vérifiez vos identifiants.");
    }
  };

  const logout = async () => {
    if (isGuest) {
      setUser(null);
      setIsGuest(false);
      return;
    }
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Erreur lors de la déconnexion Firebase:", error);
    }
    setUser(null);
    setIsGuest(false);
  };

  // Entrer en invité avec navigation pour redirection
  const enterAppAsGuest = (navigation) => {
    const guestUser = {
      uid: `guest_${Date.now()}`,
      prenom: "Invité",
      email: null,
      adresse: { adresse: "", ville: "", codePostal: "" },
      isGuest: true,
    };
    setUser(guestUser);
    setIsGuest(true);

    if (navigation) {
      navigation.reset({ index: 0, routes: [{ name: "Accueil" }] });
    }
    return { success: true, user: guestUser };
  };

  const updateUserProfile = async (userId, newData) => {
    if (!userId || userId.startsWith("guest_")) return;
    try {
      const cleanData = {};
      for (const key in newData) if (newData[key] !== undefined) cleanData[key] = newData[key];
      await updateDoc(doc(db, "users", userId), cleanData);
      setUser((prev) => (prev ? { ...prev, ...cleanData } : { uid: userId, ...cleanData }));
      return { success: true };
    } catch (error) {
      console.log("Erreur mise à jour profil:", error);
      throw new Error("Impossible de sauvegarder vos informations.");
    }
  };

  const updateUserAddress = async (userId, newAddress) => updateUserProfile(userId, { adresse: newAddress });

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        register,
        login,
        logout,
        enterAppAsGuest,
        updateUserProfile,
        updateUserAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
