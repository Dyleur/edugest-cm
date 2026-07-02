const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleve.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), eleveController.getAllEleves);
router.get('/:matricule', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE', 'ENSEIGNANT', 'PARENT']), eleveController.getEleveById);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), eleveController.createEleve);
router.put('/:matricule', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), eleveController.updateEleve);
router.delete('/:matricule', autoriser(['ADMIN', 'DIRECTEUR']), eleveController.deleteEleve);

router.get('/:matricule/notes', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), async (req, res) => {
  const { notesEleve } = require('../controllers/evaluationController');
  req.params.matricule = req.params.matricule;
  notesEleve(req, res);
});

router.get('/:matricule/presences', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), async (req, res) => {
  const presenceController = require('../controllers/presence.controller');
  presenceController.getPresencesByEleve(req, res);
});

router.get('/:matricule/paiements', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE', 'PARENT']), async (req, res) => {
  const { getByEleve } = require('../controllers/paiement.controller');
  getByEleve(req, res);
});

router.get('/:matricule/bulletin', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), async (req, res) => {
  const { genererBulletin } = require('../services/bulletinService');
  try {
    const idSession = req.query.idSession;
    if (!idSession) return res.status(400).json({ status: 400, message: 'idSession requis' });
    const bulletin = await genererBulletin(req.params.matricule, idSession);
    if (!bulletin) return res.status(404).json({ status: 404, message: 'Aucune note trouvée' });
    res.json({ status: 200, data: bulletin });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.get('/:matricule/discipline', autoriser(['ADMIN', 'DIRECTEUR']), async (req, res) => {
  const { getByEleve } = require('../controllers/discipline.controller');
  getByEleve(req, res);
});

router.get('/:matricule/parents', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), async (req, res) => {
  const { Parents, Personne } = require('../models/index');
  try {
    const parents = await Parents.findAll({
      where: { matricule: req.params.matricule },
      include: [{ model: Personne, attributes: ['idPers', 'nom', 'prenom', 'mobile'] }]
    });
    res.json({ success: true, data: parents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:matricule/parents', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), async (req, res) => {
  const { Parents } = require('../models/index');
  try {
    const parent = await Parents.create({ ...req.body, matricule: req.params.matricule, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Parent associé', data: parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
