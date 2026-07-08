const express = require('express');
const router = express.Router();
const anneeController = require('../controllers/annee.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR']));

router.get('/', anneeController.getAllAnnees);
router.get('/courante', anneeController.getAnneeCourante);
router.get('/:id', anneeController.getAnneeById);
router.post('/', anneeController.createAnnee);
router.put('/:id', anneeController.updateAnnee);
router.delete('/:id', anneeController.deleteAnnee);

module.exports = router;
