const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]), notesController.getAll);
router.get('/eleve/:matricule', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT, ROLES.PARENT]), notesController.getByEleve);
router.post('/', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]), notesController.create);
router.put('/:id', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]), notesController.update);
router.delete('/:id', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]), notesController.remove);

module.exports = router;
