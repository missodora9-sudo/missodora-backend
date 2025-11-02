import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { usePanier } from "../context/PanierContext";

export default function PanierIcon({ navigation }) {
  const { totalItems } = usePanier();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("Panier")} 
      style={styles.container}
    >
      <Text style={styles.icon}>🛒</Text>
      {totalItems > 0 && (
        <Text style={styles.badge}>{totalItems}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  icon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    color: 'white', // ← CE COLOR DOIT RESTER ICI POUR LE TEXTE
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});