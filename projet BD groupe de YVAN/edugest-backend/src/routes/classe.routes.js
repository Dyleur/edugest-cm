const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classe.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), classeController.getAllClasses);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), classeController.getClasseById);
router.get('/:id/eleves', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), classeController.getElevesByClasse);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), classeController.createClasse);
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR']), classeController.updateClasse);
router.delete('/:id', autoriser(['ADMIN']), classeController.deleteClasse);

module.exports = router;
