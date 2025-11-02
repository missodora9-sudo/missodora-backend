import React, { createContext, useContext, useState, useMemo } from "react";

const PanierContext = createContext();
export const usePanier = () => useContext(PanierContext);

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);

  // Ajouter un produit au panier (gère les doublons)
  const ajouterAuPanier = (produit) => {
    setPanier((prevPanier) => {
      const existingProduct = prevPanier.find((p) => p.id === produit.id);
      if (existingProduct) {
        return prevPanier.map((p) =>
          p.id === produit.id ? { ...p, quantite: (p.quantite || 1) + 1 } : p
        );
      } else {
        return [...prevPanier, { ...produit, quantite: 1, cartItemId: Date.now() }];
      }
    });
  };

  // Incrémenter quantité
  const incrementQuantity = (id) => {
    setPanier((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantite: (p.quantite || 1) + 1 } : p
      )
    );
  };

  // Décrémenter quantité
  const decrementQuantity = (id) => {
    setPanier((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantite: (p.quantite || 1) - 1 } : p
        )
        .filter((p) => p.quantite > 0)
    );
  };

  // Supprimer un produit via cartItemId
  const supprimerDuPanier = (cartItemId) => {
    setPanier((prev) => prev.filter((p) => p.cartItemId !== cartItemId));
  };

  // Vider complètement le panier
  const viderPanier = () => setPanier([]);

  // 🔹 Total du panier
  const total = useMemo(() => {
    return panier.reduce((sum, p) => sum + (p.prix || 0) * (p.quantite || 1), 0);
  }, [panier]);

  // 🔹 Total des articles
  const totalItems = useMemo(() => {
    return panier.reduce((sum, p) => sum + (p.quantite || 1), 0);
  }, [panier]);

  return (
    <PanierContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        incrementQuantity,
        decrementQuantity,
        supprimerDuPanier,
        viderPanier,
        total,
        totalItems,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};
