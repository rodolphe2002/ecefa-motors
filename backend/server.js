const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://ecefa-motors-7q08eus2b-kouadio-bah-rodolphes-projects.vercel.app',
  'http://localhost:3000' // utile en local
];

// === CORS ===
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Origine non autorisée :", origin);
      callback(new Error('Non autorisé par la politique CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Permet de répondre aux requêtes OPTIONS
app.options('*', cors());

// Middleware pour lire JSON
app.use(express.json());

const { MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

// === Connexion MongoDB ===
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connexion à MongoDB réussie");

    // Création d’un admin par défaut si non existant
    const exists = await Admin.findOne({ username: ADMIN_USERNAME });
    if (!exists) {
      const admin = new Admin({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
      await admin.save();
      console.log("✅ Admin créé avec succès");
    } else {
      console.log("⚠️ Admin existe déjà");
    }

    // Lancement du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));

// === Import des routes ===
const userProfileRoutes = require('./routes/userProfileRoutes');
app.use('/api', userProfileRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api', contactRoutes);

const { router: adminRoute } = require('./routes/adminRoute');
app.use('/api/admin', adminRoute);

// === Fichiers statiques (frontend) ===
app.use(express.static(path.join(__dirname, '..', 'public')));

// === Route principale ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
