// services/firebaseService.js
import { db } from '../firebase'; // Ton fichier d'initialisation Firebase
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Enregistre une commande dans Firestore
 * @param {Object} commande - La commande à enregistrer
 * @param {Object} user - L'utilisateur qui passe la commande
 */
export const enregistrerCommandeFirebase = async (commande, user) => {
  try {
    if (!user?.uid) {
      console.warn('Utilisateur non défini, impossible d’enregistrer la commande.');
      return;
    }

    const docRef = doc(collection(db, 'commandes'), commande.id || `${Date.now()}`);
    await setDoc(docRef, {
      ...commande,
      userId: user.uid,       // ⚠ Assure-toi que user.uid n'est pas undefined
      createdAt: serverTimestamp(),
    });

    console.log('Commande enregistrée sur Firebase');
  } catch (err) {
    console.error('Erreur enregistrement commande Firebase :', err);
  }
};
