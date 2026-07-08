const express = require('express');
const router = express.Router();
const disciplineController = require('../controllers/discipline.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]));

router.get('/', disciplineController.getAll);
router.get('/types', disciplineController.getTypes);
router.get('/:id', disciplineController.getById);
router.post('/', disciplineController.create);
router.put('/:id', disciplineController.update);
router.delete('/:id', disciplineController.remove);
router.post('/:id/justif', disciplineController.justify);

module.exports = router;
