const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classe.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT']));

router.get('/', classeController.getAllClasses);
router.get('/:id', classeController.getClasseById);
router.get('/:id/eleves', classeController.getElevesByClasse);
router.post('/', classeController.createClasse);
router.put('/:id', classeController.updateClasse);
router.delete('/:id', classeController.deleteClasse);

module.exports = router;
