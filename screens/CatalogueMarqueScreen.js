import { PanierContext } from "../context/PanierContext";
const { panier, setPanier } = useContext(PanierContext);

// Ajouter un produit
const ajouterAuPanier = (produit) => {
  setPanier([...panier, produit]);
};
