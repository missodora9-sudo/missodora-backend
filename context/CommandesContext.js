// src/context/CommandesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { db } from "../src/firebase";
import { collection, doc, setDoc, updateDoc, getDocs, query, where } from "firebase/firestore";

const COMMANDES_KEY = "@app_commandes";

const CommandesContext = createContext();
export const useCommandes = () => useContext(CommandesContext);

export const CommandesProvider = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [commandes, setCommandes] = useState([]);

  // --- Charger commandes depuis Firestore ou AsyncStorage ---
  useEffect(() => {
    const fetchCommandes = async () => {
      if (isGuest || !user?.uid) {
        // Invité → commandes locales
        const stored = await AsyncStorage.getItem(COMMANDES_KEY);
        setCommandes(stored ? JSON.parse(stored) : []);
      } else {
        try {
          const commandesCol = collection(db, "commandes");
          const q = query(commandesCol, where("userId", "==", user.uid));
          const snapshot = await getDocs(q);

          const data = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(cmd => !cmd.supprimee);

          setCommandes(data);

          // Persister localement
          await AsyncStorage.setItem(`${COMMANDES_KEY}_${user.uid}`, JSON.stringify(data));
        } catch (err) {
          console.warn("Erreur chargement commandes Firebase", err);
        }
      }
    };

    fetchCommandes();
  }, [user, isGuest]);

  // --- Persister localement ---
  const persistCommandes = async (nextCommandes) => {
    setCommandes(nextCommandes);
    try {
      if (isGuest) {
        await AsyncStorage.setItem(COMMANDES_KEY, JSON.stringify(nextCommandes));
      } else if (user?.uid) {
        await AsyncStorage.setItem(`${COMMANDES_KEY}_${user.uid}`, JSON.stringify(nextCommandes));
      }
    } catch (err) {
      console.warn("Erreur sauvegarde commandes", err);
    }
  };

  // --- Ajouter une commande ---
  const ajouterCommande = async (commande) => {
    const cmd = {
      id: commande.id || `CMD-${Date.now()}`,
      date: commande.date || new Date().toISOString(),
      articles: commande.articles || [],
      total: commande.total || 0,
      statut: commande.statut || "En attente de paiement",
      adresseLivraison: commande.adresseLivraison || { adresse: "", ville: "", codePostal: "" },
      paiement: commande.paiement || {},
      userId: isGuest ? "guest" : user.uid,
      supprimee: false,
    };

    if (isGuest) {
      const guestCmds = [...commandes];
      await persistCommandes([cmd, ...guestCmds]);
      return;
    }

    try {
      const commandesCol = collection(db, "commandes");
      const commandeRef = doc(commandesCol, cmd.id);
      await setDoc(commandeRef, cmd);
    } catch (err) {
      console.error("Erreur ajout commande Firebase :", err);
    }

    await persistCommandes([cmd, ...commandes]);
  };

  // --- Mettre à jour une commande ---
  const mettreAJourCommande = async (id, donneesMaj) => {
    const updatedCommandes = commandes.map(cmd => cmd.id === id ? { ...cmd, ...donneesMaj } : cmd);
    await persistCommandes(updatedCommandes);

    if (isGuest) return; // pas de Firestore pour invités

    try {
      const commandeRef = doc(db, "commandes", id);
      await updateDoc(commandeRef, { ...donneesMaj, dateMaj: new Date().toISOString() });
    } catch (err) {
      console.error("Erreur update commande Firebase :", err);
    }
  };

  // --- Supprimer une commande ---
  const supprimerCommande = async (id) => {
    const next = commandes.filter(cmd => cmd.id !== id);
    await persistCommandes(next);

    if (isGuest) return;

    try {
      const commandeRef = doc(db, "commandes", id);
      await updateDoc(commandeRef, { supprimee: true });
    } catch (err) {
      console.warn("Erreur suppression Firebase", err);
    }
  };

  // --- Supprimer plusieurs commandes ---
  const supprimerCommandes = async (ids = []) => {
    if (!ids.length) return;

    const next = commandes.filter(cmd => !ids.includes(cmd.id));
    await persistCommandes(next);

    if (isGuest) return;

    try {
      await Promise.all(
        ids.map(id => updateDoc(doc(db, "commandes", id), { supprimee: true }))
      );
    } catch (err) {
      console.warn("Erreur suppression multiple Firebase", err);
    }
  };

  // --- Réinitialiser commandes ---
  const reinitialiserCommandes = () => persistCommandes([]);

  // --- Récupérer commandes en attente ---
  const getCommandesEnAttente = () =>
    commandes.filter(cmd => cmd.statut === "En attente de paiement" || cmd.statut === "En attente");

  // --- Fusionner commandes invité dans Firestore (après inscription/connexion) ---
  const fusionnerCommandesInvité = async (nouvelUserId) => {
    if (!isGuest) return;
    const stored = await AsyncStorage.getItem(COMMANDES_KEY);
    const guestCmds = stored ? JSON.parse(stored) : [];
    if (!guestCmds.length) return;

    try {
      const commandesCol = collection(db, "commandes");
      await Promise.all(
        guestCmds.map(async cmd => {
          const commandeRef = doc(commandesCol, cmd.id);
          await setDoc(commandeRef, { ...cmd, userId: nouvelUserId });
        })
      );
      await AsyncStorage.removeItem(COMMANDES_KEY);
    } catch (err) {
      console.error("Erreur fusion commandes invité :", err);
    }
  };

  return (
    <CommandesContext.Provider
      value={{
        commandes,
        ajouterCommande,
        mettreAJourCommande,
        supprimerCommande,
        supprimerCommandes,
        reinitialiserCommandes,
        getCommandesEnAttente,
        fusionnerCommandesInvité,
      }}
    >
      {children}
    </CommandesContext.Provider>
  );
};
