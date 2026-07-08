const express = require('express');
const router = express.Router();
const bulletinsController = require('../controllers/bulletins.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT, ROLES.PARENT]));

router.get('/', bulletinsController.getAll);
router.get('/eleve/:matricule/:idSession', bulletinsController.getByEleve);
router.get('/classe/:id', bulletinsController.getByClasse);
router.get('/moyenne/:matricule/:idSession', bulletinsController.getMoyenne);

module.exports = router;
