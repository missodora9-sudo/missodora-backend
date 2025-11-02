const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const dotenv = require('dotenv');

// ⚡ Forcer override pour éviter conflit avec variable Windows
dotenv.config({ override: true });

// Debug : afficher la clé lue
console.log('STRIPE_SECRET_KEY raw:', process.env.STRIPE_SECRET_KEY ? '✓ Présente' : '✗ Manquante');
console.log('Début de la clé:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
console.log('Longueur:', process.env.STRIPE_SECRET_KEY?.length);

// Vérification de la clé Stripe
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  console.error('❌ STRIPE_SECRET_KEY manquante ou incorrecte dans .env');
  console.error('La clé doit commencer par "sk_"');
  process.exit(1);
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS plus permissive pour le développement
app.use(cors({
  origin: ['http://localhost:19006', 'http://192.168.1.81:19006', 'exp://192.168.1.81:19000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Test de connexion Stripe au démarrage
async function testStripeConnection() {
  try {
    const balance = await stripe.balance.retrieve();
    console.log('✅ Connexion Stripe réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Stripe:', error.message);
    return false;
  }
}

// Endpoint pour créer un PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    console.log('📦 Requête reçue:', { amount, currency });

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    // Conversion en cents
    const amountInCents = Math.round(parseFloat(amount) * 100);
    console.log('💶 Montant en cents:', amountInCents);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      // Ajout de métadonnées pour le debugging
      metadata: {
        integration_check: 'accept_a_payment'
      }
    });

    console.log('✅ PaymentIntent créé:', paymentIntent.id);
    console.log('🔑 ClientSecret:', paymentIntent.client_secret);

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });

  } catch (err) {
    console.error('❌ Erreur Stripe détaillée:');
    console.error('Message:', err.message);
    console.error('Type:', err.type);
    console.error('Code:', err.code);
    
    res.status(500).json({ 
      error: err.message || 'Impossible de créer PaymentIntent',
      type: err.type,
      code: err.code
    });
  }
});

// Endpoint de test Stripe
app.get('/test-stripe', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ 
      status: 'SUCCESS', 
      message: 'Connexion Stripe OK',
      balance: balance
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      error: error.message,
      keyUsed: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...'
    });
  }
});

// Endpoint santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripe: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'
  });
});

app.get('/', (req, res) => res.json({ 
  message: '✅ Serveur Stripe en ligne',
  endpoints: ['/health', '/test-stripe', '/create-payment-intent']
}));

// Démarrer le serveur après test Stripe
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test Stripe: http://localhost:${PORT}/test-stripe`);
  
  // Tester la connexion Stripe
  await testStripeConnection();
});