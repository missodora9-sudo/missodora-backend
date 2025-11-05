import React, { useEffect, useRef } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function AccueilScreen({ navigation }) {
  const { user, logout } = useAuth();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // 🔄 Animation du logo MissOdora (rotation infinie)
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#fff0f5", "#ffe6f0", "#fff"]}
      style={styles.gradient}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🌸 Titre principal */}
        <Text style={styles.titre}>Bienvenue sur MissOdora 💖</Text>

        {/* 👩 Bonjour + bouton déconnexion */}
        {user && (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>Bonjour, {user.prenom || "Invité"} 🌷</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 💫 Logo MissOdora animé */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("../assets/images/MissOdoraLogo.png")}
            style={[
              styles.logo,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          />
        </View>

        {/* 🎀 Boutons principaux */}
        <View style={styles.boutonsContainer}>
          <LinearGradient colors={['#ffb6c1', '#ff69b4']} style={styles.bouton}>
            <TouchableOpacity onPress={() => navigation.navigate("VenteFlash")}>
              <Text style={styles.boutonTexte}>⚡ Vente Flash</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={['#d66d75', '#e29587']} style={styles.bouton}>
            <TouchableOpacity onPress={() => navigation.navigate("Diverse")}>
              <Text style={styles.boutonTexte}>🎁 Diverses</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.bouton}>
            <TouchableOpacity onPress={() => navigation.navigate("Marques")}>
              <Text style={styles.boutonTexte}>🌸 Parfums</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    padding: 20,
    minHeight: height,
  },
  titre: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#c2185b",
    marginTop: 40,
    textAlign: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  userText: {
    fontSize: 18,
    color: "#333",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#c2185b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  boutonsContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 60,
  },
  bouton: {
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  boutonTexte: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
