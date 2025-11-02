import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert
} from 'react-native';
import { useCommandes } from '../context/CommandesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import { serverTimestamp } from 'firebase/firestore';
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function PaiementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { commande } = route.params;
  const { mettreAJourCommande } = useCommandes();
  const { user, isGuest, loading: authLoading } = useAuth();
  const { confirmPayment } = useStripe();

  const [formData, setFormData] = useState({ adresse: '', ville: '', codePostal: '' });
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const TVA = 0.2;
  const montantHT = commande?.total || 0;
  const montantTVA = montantHT * TVA;
  const totalTTC = montantHT * (1 + TVA);

  useEffect(() => {
    if (authLoading) return;

    if (user && !isGuest && user.adresse) {
      setFormData({
        adresse: user.adresse.adresse || '',
        ville: user.adresse.ville || '',
        codePostal: user.adresse.codePostal || '',
      });
    } else {
      setFormData({ adresse: '', ville: '', codePostal: '' });
    }
  }, [user, isGuest, commande, authLoading]);

  const genererFacturePDF = async () => {
    const dateFacture = new Date().toLocaleDateString('fr-FR');
    const numeroFacture = `FAC-${commande.id}-${Date.now()}`;
    const produitsHTML = (commande.articles || []).map((item, index) => `
      <tr style="${index % 2 === 0 ? 'background-color: #f8f9fa;' : 'background-color: #ffffff;'}">
        <td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6;">${item.nom}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6; text-align: center;">${item.quantite}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6; text-align: right;">${(item.prix || 0).toFixed(2)} €</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6; text-align: right; font-weight: bold;">${((item.prix || 0) * (item.quantite || 1)).toFixed(2)} €</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 40px; color: #333; background-color: #ffffff; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #4c669f; }
      .logo-section { flex: 1; }
      .company-name { font-size: 28px; font-weight: bold; color: #4c669f; margin-bottom: 5px; }
      .company-details { font-size: 12px; color: #666; line-height: 1.4; }
      .invoice-info { text-align: right; flex: 1; }
      .invoice-title { font-size: 32px; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
      .invoice-number { font-size: 16px; color: #7f8c8d; margin-bottom: 5px; }
      .client-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
      .client-title { font-weight: bold; color: #4c669f; margin-bottom: 10px; font-size: 16px; }
      table { width: 100%; border-collapse: collapse; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
      th { background-color: #4c669f; color: white; padding: 16px 8px; text-align: left; font-weight: bold; font-size: 14px; }
      td { padding: 12px 8px; border-bottom: 1px solid #dee2e6; }
      .totals { margin-top: 30px; text-align: right; }
      .total-line { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 20px; }
      .total-label { font-weight: bold; color: #555; }
      .total-amount { font-weight: bold; min-width: 120px; text-align: right; }
      .total-ttc { font-size: 20px; color: #27ae60; border-top: 2px solid #34495e; padding-top: 10px; margin-top: 10px; }
      .footer { margin-top: 50px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #bdc3c7; padding-top: 20px; }
      .thank-you { text-align: center; margin-top: 30px; font-style: italic; color: #4c669f; font-size: 16px; }
    </style></head><body>
      <div class="header">
        <div class="logo-section">
          <div class="company-name">MissOdora</div>
          <div class="company-details">
            123 Avenue des Parfums<br>75001 Paris, France<br>Tél: +33 1 23 45 67 89<br>Email: contact@missodora.com<br>SIRET: 123 456 789 00012
          </div>
        </div>
        <div class="invoice-info">
          <div class="invoice-title">FACTURE</div>
          <div class="invoice-number">N° ${numeroFacture}</div>
          <div>Date: ${dateFacture}</div>
          <div>Commande: ${commande.id}</div>
        </div>
      </div>
      <div class="client-info">
        <div class="client-title">CLIENT</div>
        <div><strong>${user?.prenom || 'Invité'} ${user?.nom || ''}</strong></div>
        <div>${user?.email || 'Non renseigné'}</div>
        <div>${formData.adresse || 'Non renseignée'}</div>
        <div>${formData.codePostal || ''} ${formData.ville || ''}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>PRODUIT</th>
            <th style="text-align: center;">QUANTITÉ</th>
            <th style="text-align: right;">PRIX UNITAIRE</th>
            <th style="text-align: right;">SOUS-TOTAL</th>
          </tr>
        </thead>
        <tbody>${produitsHTML}</tbody>
      </table>
      <div class="totals">
        <div class="total-line"><span class="total-label">Sous-total HT:</span><span class="total-amount">${montantHT.toFixed(2)} €</span></div>
        <div class="total-line"><span class="total-label">TVA (20%):</span><span class="total-amount">${montantTVA.toFixed(2)} €</span></div>
        <div class="total-line total-ttc"><span class="total-label">TOTAL TTC:</span><span class="total-amount">${totalTTC.toFixed(2)} €</span></div>
      </div>
      <div class="thank-you">Merci pour votre confiance et à bientôt chez MissOdora !</div>
      <div class="footer">MissOdora - SAS au capital de 50 000 € - TVA FR 12 345678901<br>Facture électronique - Cette facture fait foi d'original</div>
    </body></html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      return uri;
    } catch (error) {
      throw error;
    }
  };

  const envoyerFactureParMail = async () => {
    if (!user?.email) return;
    try {
      const uri = await genererFacturePDF();
      await MailComposer.composeAsync({
        recipients: [user.email],
        subject: `Votre facture MissOdora - Commande ${commande.id}`,
        body: `Bonjour ${user.prenom || ''},\nVotre commande a été confirmée avec succès.\nMerci pour votre achat chez MissOdora.`,
        attachments: [uri],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaiement = async () => {
    if (isGuest) {
      navigation.navigate('Register', { commande, returnTo: 'Paiement' });
      return;
    }

    if (!formData.adresse || !formData.ville || !formData.codePostal) {
      Alert.alert("Erreur", "Veuillez compléter votre adresse de livraison.");
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert("Erreur", "Veuillez compléter les informations de votre carte.");
      return;
    }

    setLoading(true);
    try {
      const SERVER_URL = 'http://192.168.1.81:3000';
      const response = await fetch(`${SERVER_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalTTC, currency: 'eur' }),
      });
      const { clientSecret, error: serverError } = await response.json();
      if (serverError || !clientSecret) { setLoading(false); return; }

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Client MissOdora',
            email: user.email || '',
            address: { line1: formData.adresse, postalCode: formData.codePostal, city: formData.ville, country: 'FR' },
          },
        },
      });

      if (error) { Alert.alert("Erreur de paiement", error.message || "Une erreur est survenue."); }
      else if (paymentIntent) {
        await mettreAJourCommande(commande.id, {
          statut: 'Payée',
          adresseLivraison: { ...formData },
          totalTTC,
          datePaiement: serverTimestamp(),
          stripePaymentIntentId: paymentIntent.id,
        });

        setFormData({ adresse: '', ville: '', codePostal: '' });
        setCardDetails(null);

        Alert.alert(
          "Paiement réussi ✅",
          "Votre commande a été confirmée avec succès !",
          [
            { text: "Voir mes commandes", onPress: () => navigation.navigate('MesCommandes') },
            { text: "Recevoir la facture", onPress: async () => { await envoyerFactureParMail(); navigation.navigate('MesCommandes'); } }
          ]
        );
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paiement Sécurisé</Text>

      {isGuest && (
        <View style={styles.guestWarning}>
          <Text style={styles.guestWarningText}>⚠️ Vous devez créer un compte pour finaliser votre achat</Text>
        </View>
      )}

      {!isGuest && (
        <View style={styles.section}>
          <Text style={styles.label}>Adresse de livraison</Text>
          <TextInput style={styles.input} placeholder="Adresse complète" value={formData.adresse} onChangeText={text => setFormData({ ...formData, adresse: text })} />
          <TextInput style={styles.input} placeholder="Ville" value={formData.ville} onChangeText={text => setFormData({ ...formData, ville: text })} />
          <TextInput style={styles.input} placeholder="Code postal" keyboardType="numeric" value={formData.codePostal} onChangeText={text => setFormData({ ...formData, codePostal: text })} />
        </View>
      )}

      {!isGuest && (
        <View style={styles.section}>
          <Text style={styles.label}>Carte bancaire</Text>
          <CardField
            postalCodeEnabled={false}
            placeholder={{ number: '4242 4242 4242 4242' }}
            cardStyle={{ backgroundColor: '#fff', textColor: '#000', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}
            style={{ width: '100%', height: 50, marginVertical: 20 }}
            onCardChange={setCardDetails}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Résumé de la commande</Text>
        <View style={styles.summaryRow}><Text>Sous-total HT:</Text><Text>{montantHT.toFixed(2)} €</Text></View>
        <View style={styles.summaryRow}><Text>TVA (20%):</Text><Text>{montantTVA.toFixed(2)} €</Text></View>
        <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalLabel}>Total TTC:</Text><Text style={styles.totalAmount}>{totalTTC.toFixed(2)} €</Text></View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePaiement}
        disabled={loading || (!isGuest && !cardDetails?.complete)}
      >
        {loading ? <ActivityIndicator color="#fff" /> : (
          isGuest ? <Text style={styles.buttonText}>Créer un compte pour payer</Text> : <Text style={styles.buttonText}>Payer {totalTTC.toFixed(2)} €</Text>
        )}
      </TouchableOpacity>

      {!isGuest && (
        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>🔒 Paiement 100% sécurisé par Stripe</Text>
          <Text style={styles.securitySubText}>Vos données bancaires sont cryptées et ne sont jamais stockées sur nos serveurs</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#4c669f' },
  guestWarning: { backgroundColor: '#fff3cd', padding: 15, borderRadius: 8, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#ffc107' },
  guestWarningText: { color: '#856404', fontWeight: '500', textAlign: 'center' },
  section: { marginBottom: 20, backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  label: { fontWeight: 'bold', marginBottom: 15, fontSize: 18, color: '#2c3e50' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 12, fontSize: 16, backgroundColor: '#fafafa' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  totalRow: { borderBottomWidth: 0, marginTop: 10, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#bdc3c7' },
  totalLabel: { fontWeight: 'bold', fontSize: 18, color: '#2c3e50' },
  totalAmount: { fontWeight: 'bold', fontSize: 20, color: '#27ae60' },
  button: { backgroundColor: '#4c669f', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  buttonDisabled: { backgroundColor: '#bdc3c7' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  securityInfo: { backgroundColor: '#e7f3ff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  securityText: { fontWeight: 'bold', color: '#0066cc', marginBottom: 5 },
  securitySubText: { fontSize: 12, color: '#666', textAlign: 'center' }
});
