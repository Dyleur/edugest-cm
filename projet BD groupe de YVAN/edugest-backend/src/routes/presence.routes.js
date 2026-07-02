const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.post('/appel', autoriser(['ENSEIGNANT']), presenceController.marquerPresent);
router.put('/present', autoriser(['ENSEIGNANT', 'DIRECTEUR']), presenceController.marquerPresent);
router.put('/absent', autoriser(['ENSEIGNANT', 'DIRECTEUR']), presenceController.marquerAbsent);
router.get('/salle/:idSalle/annee/:idAcademi', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), presenceController.getPresencesBySalle);
router.get('/eleve/:matricule', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']), presenceController.getPresencesByEleve);
router.get('/stats', autoriser(['ADMIN', 'DIRECTEUR']), presenceController.getStatistiquesBySalle);
router.get('/stats/salle/:idSalle/annee/:idAcademi', autoriser(['ADMIN', 'DIRECTEUR']), presenceController.getStatistiquesBySalle);

module.exports = router;
