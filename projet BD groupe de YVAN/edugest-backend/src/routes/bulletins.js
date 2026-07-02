const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const { calculerMoyenne, genererBulletin } = require('../services/bulletinService');
const { Evaluation, Cours, Eleve, Session, Trimestre, sequelize } = require('../models/index');

router.use(verifyToken);

router.get('/eleve/:matricule/:idSession', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), async (req, res) => {
  try {
    const bulletin = await genererBulletin(req.params.matricule, req.params.idSession);
    if (!bulletin) return res.status(404).json({ status: 404, message: 'Aucune note trouvée' });
    res.json({ status: 200, data: bulletin });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.get('/classe/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), async (req, res) => {
  try {
    const { Frequente, Salle } = require('../models/index');
    const salles = await Salle.findAll({ where: { idClasse: req.params.id, actif: 1 } });
    const matricules = await Frequente.findAll({
      where: { idSalle: salles.map(s => s.idSalle) },
      attributes: ['matricule'],
      group: ['matricule']
    });
    const bulletins = [];
    for (const f of matricules) {
      const bulletin = await genererBulletin(f.matricule, req.query.idSession);
      if (bulletin) bulletins.push(bulletin);
    }
    res.json({ status: 200, data: bulletins });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.get('/moyenne/:matricule/:idSession', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), async (req, res) => {
  try {
    const moyenne = await calculerMoyenne(req.params.matricule, req.params.idSession);
    res.json({ status: 200, data: { matricule: req.params.matricule, idSession: req.params.idSession, moyenne } });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
