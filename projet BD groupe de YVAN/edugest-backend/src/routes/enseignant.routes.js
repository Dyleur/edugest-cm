const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignant.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), enseignantController.getAllEnseignants);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR']), enseignantController.getEnseignantById);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), enseignantController.createEnseignant);
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR']), enseignantController.updateEnseignant);
router.delete('/:id', autoriser(['ADMIN']), enseignantController.deleteEnseignant);

module.exports = router;
