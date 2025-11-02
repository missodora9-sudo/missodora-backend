import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useCommandes } from "../context/CommandesContext";

export default function CommandesIcon({ navigation }) {
  const { commandes } = useCommandes();
  const totalCommandes = commandes.length;

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("MesCommandes")} 
      style={styles.container}
    >
      <Text style={styles.icon}>📦</Text>
      {totalCommandes > 0 && (
        <Text style={styles.badge}>{totalCommandes}</Text>
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
    backgroundColor: '#ff3b30',
    color: 'white',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});