import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Composant pour une particule individuelle
const Particle = ({ size, color, duration, delay, startX, startY }) => {
  const opacityValue = useRef(new Animated.Value(0)).current;
  const positionValue = useRef(new Animated.ValueXY({ x: startX, y: startY })).current;
  const scaleValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateParticle = () => {
      // Animation de montée avec effet de flottement
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.8,
            duration: duration * 0.3,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: duration * 0.7,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(positionValue, {
          toValue: { 
            x: startX + (Math.random() - 0.5) * 100, // Léger déplacement horizontal aléatoire
            y: startY - 200 - Math.random() * 100 // Montée vers le haut
          },
          duration: duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: duration * 0.4,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.5,
            duration: duration * 0.6,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Réinitialiser et relancer l'animation
        opacityValue.setValue(0);
        positionValue.setValue({ x: startX, y: startY });
        scaleValue.setValue(0.3);
        setTimeout(animateParticle, Math.random() * 2000);
      });
    };

    const timer = setTimeout(animateParticle, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          opacity: opacityValue,
          transform: [
            { translateX: positionValue.x },
            { translateY: positionValue.y },
            { scale: scaleValue }
          ],
        },
      ]}
    />
  );
};

// Composant pour générer plusieurs particules
const FloatingParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }).map((_, index) => {
    const size = 6 + Math.random() * 12;
    const colors = [
      'rgba(255, 182, 193, 0.6)', // Rose pâle
      'rgba(147, 112, 219, 0.5)', // Violet
      'rgba(255, 215, 0, 0.4)',   // Or
      'rgba(173, 216, 230, 0.5)', // Bleu pâle
      'rgba(152, 251, 152, 0.4)', // Vert pâle
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 4000 + Math.random() * 6000;
    const delay = Math.random() * 8000;
    const startX = Math.random() * width;
    const startY = height + Math.random() * 100;

    return (
      <Particle
        key={index}
        size={size}
        color={color}
        duration={duration}
        delay={delay}
        startX={startX}
        startY={startY}
      />
    );
  });

  return <View style={StyleSheet.absoluteFill}>{particles}</View>;
};

export default function BienvenueScreen({ navigation }) {
  const { enterAppAsGuest, user } = useAuth(); // ✅ Ajout de user pour le debug
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(50)).current;
  const glowValue = useRef(new Animated.Value(0.5)).current;

  // Debug de l'état utilisateur
  useEffect(() => {
    console.log("👤 BienvenueScreen - État user:", user ? `${user.prenom} (${user.uid})` : 'Non connecté');
  }, [user]);

  // Animations combinées
  useEffect(() => {
    // Animation logo
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.08,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(glowValue, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );

    // Animation entrée écran
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    scaleAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.7, 1],
  });

  const handleEnter = async () => {
    try {
      console.log("🎯 Début de la connexion invité...");
      
      // ✅ Appel simple - le RootNavigator basculera automatiquement
      const result = enterAppAsGuest();
      
      console.log("✅ Connexion invité déclenchée:", result);
      console.log("🔄 Attente du basculement automatique vers l'app...");
      
    } catch (err) {
      console.warn("❌ Erreur lors de l'entrée en invité", err);
      alert("Impossible de se connecter en tant qu'invité. Veuillez réessayer.");
    }
  };

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef', '#f8f9fa']}
      style={styles.container}
    >
      {/* Particules flottantes en arrière-plan */}
      <FloatingParticles count={12} />

      {/* Effet de brillance animé derrière le logo */}
      <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]} />
      
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeValue,
          transform: [{ translateY: slideValue }]
        }
      ]}>
        {/* Container du logo avec double bordure */}
        <View style={styles.logoOuterContainer}>
          <Animated.View 
            style={[
              styles.logoMiddleContainer,
              {
                transform: [{ rotate: rotate }]
              }
            ]}
          >
            <View style={styles.logoInnerContainer}>
              <Animated.Image
                source={require('../assets/MissOdoraLogo.png')}
                style={[
                  styles.logo,
                  {
                    transform: [{ scale: scaleValue }]
                  }
                ]}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </View>

        <Text style={styles.title}>Bienvenue chez MissOdora</Text>
        <Text style={styles.subtitle}>
          Découvrez l'univers des parfums d'exception
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Créer un compte</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={handleEnter}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Explorer en invité</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Éléments décoratifs */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    zIndex: 1,
  },
  glowEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 107, 139, 0.1)',
    top: height * 0.15,
    zIndex: 2,
  },
  logoOuterContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 5,
  },
  logoMiddleContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'transparent',
    borderLeftColor: '#FF6B8B',
    borderRightColor: '#667eea',
    borderTopColor: '#4facfe',
    borderBottomColor: '#f093fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInnerContainer: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: '75%',
    height: '75%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2d3748',
    letterSpacing: 0.5,
    zIndex: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    letterSpacing: 0.3,
    fontStyle: 'italic',
    zIndex: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    zIndex: 10,
  },
  button: {
    width: '85%',
    marginBottom: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    top: height * 0.1,
    left: width * 0.1,
    zIndex: 1,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 107, 139, 0.08)',
    bottom: height * 0.15,
    right: width * 0.1,
    zIndex: 1,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    bottom: height * 0.3,
    left: width * 0.05,
    zIndex: 1,
  },
});