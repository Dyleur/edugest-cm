const express = require('express');
const router = express.Router();
const rapportController = require('../controllers/rapport.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/effectifs', autoriser(['ADMIN', 'DIRECTEUR']), rapportController.effectifs);
router.get('/resultats', autoriser(['ADMIN', 'DIRECTEUR']), rapportController.resultats);
router.get('/presences', autoriser(['ADMIN', 'DIRECTEUR']), rapportController.presences);
router.get('/finances', autoriser(['ADMIN', 'DIRECTEUR']), rapportController.finances);
router.get('/discipline', autoriser(['ADMIN', 'DIRECTEUR']), rapportController.disciplineRapport);

module.exports = router;
