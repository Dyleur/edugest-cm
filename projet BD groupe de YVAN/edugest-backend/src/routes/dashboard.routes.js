const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const { Eleve, Enseignant, Personne, Paiement, Frequente, AnneeAcademique } = require('../models/index');
const { Op } = require('sequelize');

router.use(verifyToken);

router.get('/stats', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), async (req, res) => {
  try {
    const eleves = await Eleve.count({ where: { actif: 1 } });
    const enseignants = await Enseignant.count({ where: { Actif: 1 } });
    const classes = await Frequente.count({ distinct: true, col: 'idSalle' });
    const annee = await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] });
    const totalPaiements = await Paiement.sum('montant', { where: { idAca: annee?.idAnnee } });
    res.json({ success: true, data: { eleves, enseignants, classes, totalPaiements: totalPaiements || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
