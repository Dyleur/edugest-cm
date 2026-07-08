const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']));

router.post('/appel', presenceController.faireAppel);
router.put('/present', presenceController.marquerPresent);
router.put('/absent', presenceController.marquerAbsent);

router.get('/salle/:idSalle/annee/:idAcademi', presenceController.getPresencesBySalle);
router.get('/eleve/:matricule', presenceController.getPresencesByEleve);
router.get('/eleve/:matricule/absences', presenceController.getAbsencesByEleve);
router.get('/stats', presenceController.getGlobalStats);
router.get('/stats/salle/:idSalle/annee/:idAcademi', presenceController.getStatistiquesBySalle);

module.exports = router;
