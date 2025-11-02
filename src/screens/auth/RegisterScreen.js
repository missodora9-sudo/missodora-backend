import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  ImageBackground, Animated, KeyboardAvoidingView, Platform,
  ActivityIndicator, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';

export default function RegisterScreen({ navigation, route }) {
  const { register } = useAuth();
  const commande = route.params?.commande; // Commande depuis PaiementScreen
  const returnTo = route.params?.returnTo;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',     // Champs adresse ajoutés
    ville: '',
    codePostal: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const background = require('../../../assets/bg-gradient.jpg');

  const phoneMask = (text) => {
    const nums = text.replace(/\D/g, '');
    let out = '';
    for (let i = 0; i < nums.length && i < 10; i++) {
      if (i === 0) out += nums[i];
      else if (i % 2 === 1) out += ' ' + nums[i];
      else out += nums[i];
    }
    return out;
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.prenom.trim()) e.prenom = 'Prénom requis';
      if (!form.email.trim() || !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}$/.test(form.email))
        e.email = 'Email invalide';
    }
    if (step === 2) { // Validation des champs adresse
      if (!form.adresse.trim()) e.adresse = 'Adresse requise';
      if (!form.ville.trim()) e.ville = 'Ville requise';
      if (!/^\d{5}$/.test(form.codePostal)) e.codePostal = 'Code postal invalide';
    }
    if (step === 3) {
      if (form.password.length < 8) e.password = '8 caractères minimum';
      if (form.password !== form.passwordConfirm)
        e.passwordConfirm = 'Les mots de passe ne correspondent pas';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleRegister = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      await register(
        form.email.trim(),
        form.password,
        form.prenom.trim(),
        form.nom.trim(),
        form.telephone.trim(),
        {
          adresse: form.adresse.trim(),
          ville: form.ville.trim(),
          codePostal: form.codePostal.trim(),
        }
      );

      Animated.sequence([
        Animated.timing(successAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(successAnim, { toValue: 0, duration: 600, delay: 1000, useNativeDriver: true }),
      ]).start(() => {
        // Retour vers Paiement si l'utilisateur vient de l'écran paiement
        if (returnTo === 'Paiement' && commande) {
          navigation.replace('Paiement', { commande });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Marques' }] });
        }
      });
    } catch (err) {
      setErrors({ global: err.message || "Erreur lors de l'inscription" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={background} style={styles.bg} imageStyle={{ opacity: 0.9 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: 'transparent' }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Créer un compte</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Animated.View style={styles.card}>
            <Text style={styles.title}>Étape {step} sur 3</Text>

            {errors.global && <Text style={styles.error}>{errors.global}</Text>}

            {step === 1 && (
              <>
                <TextInput
                  style={[styles.input, errors.prenom && styles.inputError]}
                  placeholder="Prénom *"
                  value={form.prenom}
                  onChangeText={(t) => setForm({ ...form, prenom: t })}
                />
                {errors.prenom && <Text style={styles.error}>{errors.prenom}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  value={form.nom}
                  onChangeText={(t) => setForm({ ...form, nom: t })}
                />

                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email *"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                  value={form.telephone}
                  onChangeText={(t) => setForm({ ...form, telephone: phoneMask(t) })}
                  maxLength={14}
                />
              </>
            )}

            {step === 2 && (
              <>
                <TextInput
                  style={[styles.input, errors.adresse && styles.inputError]}
                  placeholder="Adresse *"
                  value={form.adresse}
                  onChangeText={(t) => setForm({ ...form, adresse: t })}
                />
                {errors.adresse && <Text style={styles.error}>{errors.adresse}</Text>}

                <TextInput
                  style={[styles.input, errors.ville && styles.inputError]}
                  placeholder="Ville *"
                  value={form.ville}
                  onChangeText={(t) => setForm({ ...form, ville: t })}
                />
                {errors.ville && <Text style={styles.error}>{errors.ville}</Text>}

                <TextInput
                  style={[styles.input, errors.codePostal && styles.inputError]}
                  placeholder="Code Postal *"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={form.codePostal}
                  onChangeText={(t) => setForm({ ...form, codePostal: t })}
                />
                {errors.codePostal && <Text style={styles.error}>{errors.codePostal}</Text>}
              </>
            )}

            {step === 3 && (
              <>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Mot de passe *"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                />
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}

                <TextInput
                  style={[styles.input, errors.passwordConfirm && styles.inputError]}
                  placeholder="Confirmer le mot de passe *"
                  secureTextEntry
                  value={form.passwordConfirm}
                  onChangeText={(t) => setForm({ ...form, passwordConfirm: t })}
                />
                {errors.passwordConfirm && <Text style={styles.error}>{errors.passwordConfirm}</Text>}
              </>
            )}

            <View style={styles.navButtons}>
              {step > 1 && (
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={prevStep}>
                  <Text style={[styles.buttonText, { color: '#333' }]}>Retour</Text>
                </TouchableOpacity>
              )}
              {step < 3 && (
                <TouchableOpacity style={styles.button} onPress={nextStep}>
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              )}
              {step === 3 && (
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Créer mon compte</Text>}
                </TouchableOpacity>
              )}
            </View>

            <Animated.View style={[styles.successBadge, { opacity: successAnim }]}>
              <Text style={styles.successText}>✅ Compte créé avec succès !</Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, paddingTop: 10, marginBottom: 10 },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  cancelText: { color: '#888', fontSize: 15 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 720, backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e6e7ee', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 8, backgroundColor: '#fff' },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginBottom: 8, fontSize: 13 },
  button: { backgroundColor: '#2E86DE', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  successBadge: { marginTop: 16, alignSelf: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#34d399' },
  successText: { color: '#065f46', fontWeight: '700' },
});
