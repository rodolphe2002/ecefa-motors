const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('./models/Admin'); // Assure-toi que ce chemin est correct

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connexion à MongoDB réussie");

    // Création auto de l'admin si inexistant
    const exists = await Admin.findOne({ username: ADMIN_USERNAME });
    if (exists) {
      console.log("⚠️ Admin existe déjà.");
    } else {
      const admin = new Admin({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
      await admin.save();
      console.log("✅ Admin créé avec succès");
    }

    // Lancer le serveur après la connexion MongoDB
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log("❌ Erreur MongoDB :", err));

// Routes API
const userProfileRoutes = require('./routes/userProfileRoutes');
app.use('/api', userProfileRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api', contactRoutes);

const { router: adminRoute } = require('./routes/adminRoute');
app.use('/api/admin', adminRoute);

// Fichiers statiques
app.use(express.static(path.join(__dirname, '..', 'public')));

// Page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
