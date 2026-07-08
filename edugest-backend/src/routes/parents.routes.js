const express = require('express');
const router = express.Router();
const parentsController = require('../controllers/parents.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']));

router.get('/', parentsController.getAll);
router.get('/:id', parentsController.getById);
router.post('/', parentsController.create);
router.put('/:id', parentsController.update);
router.delete('/:id', parentsController.remove);
router.get('/:idParent/enfants', parentsController.getEnfants);

module.exports = router;
