const express = require('express');
const router = express.Router();
const anneeController = require('../controllers/annee.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), anneeController.getAllAnnees);
router.get('/courante', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'SECRETAIRE', 'PARENT']), anneeController.getAllAnnees);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR']), anneeController.getAnneeById);
router.post('/', autoriser(['ADMIN']), anneeController.createAnnee);
router.put('/:id', autoriser(['ADMIN']), anneeController.updateAnnee);
router.delete('/:id', autoriser(['ADMIN']), anneeController.deleteAnnee);

module.exports = router;
