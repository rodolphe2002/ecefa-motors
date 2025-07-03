const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = new ContactMessage({
  name,
  email,
  phone,
  subject,
  message,
  isRead: false // 👈 Marqué comme non lu par défaut
});
    await newMessage.save();

    res.status(201).json({ message: 'Message enregistré avec succès' });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});


// recuperations des messages

router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 }).limit(10); // derniers 10
    res.json(messages);
  } catch (error) {
    console.error("Erreur récupération messages :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des messages" });
  }
});


//  API pour compter les messages non lus

router.get('/contact-messages/unread-count', async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    console.error("Erreur récupération du nombre de messages non lus :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du nombre de messages non lus" });
  }
});


// api pour marquer un message comme lu

router.post('/contact-messages/mark-read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur mise à jour message :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du message" });
  }
});



module.exports = router;
