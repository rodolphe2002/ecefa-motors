const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

router.post('/save-profile', async (req, res) => {
    try {
        const { profileType, name, phone, email, extraInfo } = req.body;

        const newProfile = new UserProfile({
            profileType, name, phone, email, extraInfo
        });

        await newProfile.save();
        res.status(201).json({ message: "Profil enregistré avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement du profil" });
    }
});




router.get('/profiles', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
        let query = UserProfile.find().sort({ createdAt: -1 });
        if (!isNaN(limit) && limit > 0) {
            query = query.limit(limit);
        }
        const profiles = await query;
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des profils" });
    }
});

// Supprimer un profil par ID
router.delete('/profiles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await UserProfile.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Profil introuvable' });
        res.json({ message: 'Profil supprimé' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du profil' });
    }
});

// Suppression multiple de profils
router.post('/profiles/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Liste d'IDs invalide" });
        }
        const result = await UserProfile.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Profils supprimés', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression multiple' });
    }
});

// route pour compter

router.get('/notifications/new-users', async (req, res) => {
    try {
        const count = await UserProfile.countDocuments({ status: 'new' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du comptage des nouveaux profils" });
    }
});


// route pour marquer l'inscrit comme lu 
router.post('/notifications/mark-read', async (req, res) => {
    try {
        await UserProfile.updateMany({ status: 'new' }, { $set: { status: 'viewed' } });
        res.json({ message: "Notifications mises à jour" });
    } catch (error) {
        res.status(500).json({ error: "Erreur de mise à jour" });
    }
});


// API de calcul de croissance mensuelle 

router.get('/stats/monthly-growth', async (req, res) => {
    try {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const previousCount = await UserProfile.countDocuments({
            createdAt: { $gte: lastMonth, $lt: thisMonth }
        });

        const currentCount = await UserProfile.countDocuments({
            createdAt: { $gte: thisMonth }
        });

        const growth = previousCount === 0
            ? 100
            : ((currentCount - previousCount) / previousCount) * 100;

        res.json({ growth: Math.round(growth) });
    } catch (error) {
        res.status(500).json({ error: "Erreur de calcul de croissance" });
    }
});



module.exports = router;
