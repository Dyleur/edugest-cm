const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const { Parents, Personne, Eleve, Frequente, Salle, Classe } = require('../models/index');

router.use(verifyToken);

router.get('/:id/enfants', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN', 'PARENT']), async (req, res) => {
  try {
    const enfants = await Parents.findAll({
      where: { idPers: req.params.id },
      include: [
        { model: Eleve, attributes: ['matricule', 'nom', 'prenom', 'dateNaissance', 'sexe', 'langue', 'photoURL'] }
      ]
    });
    const result = [];
    for (const e of enfants) {
      const freq = await Frequente.findOne({
        where: { matricule: e.matricule },
        include: [{ model: Salle, include: [{ model: Classe, attributes: ['idClasse', 'libelle'] }] }],
        order: [['created_at', 'DESC']]
      });
      result.push({
        ...e.Eleve?.toJSON(),
        lienParente: e.lienParente,
        classe: freq?.Salle?.Classe?.libelle || 'Non assigné',
        salle: freq?.Salle?.libelle || ''
      });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
