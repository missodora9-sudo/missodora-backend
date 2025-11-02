import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useCommandes } from "./CommandesContext";

export default function CommandesResetWatcher() {
  const { user } = useAuth();
  const { reinitialiserCommandes } = useCommandes();
  const previousUserId = useRef(null);

  useEffect(() => {
    // Si l'utilisateur change, on réinitialise les commandes
    if (previousUserId.current && previousUserId.current !== user?.id) {
      reinitialiserCommandes();
    }
    previousUserId.current = user?.id;
  }, [user, reinitialiserCommandes]);

  return null; // Composant invisible
}
