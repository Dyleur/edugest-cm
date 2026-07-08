const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscription.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), inscriptionController.getAllInscriptions);
router.get('/eleve/:matricule', autoriser(['ADMIN', 'DIRECTEUR']), inscriptionController.getInscriptionsByEleve);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), inscriptionController.inscrireEleve);
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR']), inscriptionController.updateInscription);
router.delete('/:id', autoriser(['ADMIN']), inscriptionController.deleteInscription);

module.exports = router;
