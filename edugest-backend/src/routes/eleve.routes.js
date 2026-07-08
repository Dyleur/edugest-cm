const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleve.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']));

router.get('/', eleveController.getAllEleves);
router.get('/:matricule', eleveController.getEleveById);
router.get('/:matricule/notes', eleveController.getEleveNotes);
router.get('/:matricule/presences', eleveController.getElevePresences);
router.get('/:matricule/paiements', eleveController.getElevePaiements);
router.get('/:matricule/bulletin', eleveController.getEleveBulletin);
router.get('/:matricule/discipline', eleveController.getEleveDiscipline);
router.get('/:matricule/parents', eleveController.getEleveParents);
router.post('/', eleveController.createEleve);
router.post('/:matricule/parents', eleveController.addEleveParent);
router.put('/:matricule', eleveController.updateEleve);
router.delete('/:matricule', eleveController.deleteEleve);

module.exports = router;
