const express = require('express');
const router = express.Router();
const disciplineController = require('../controllers/discipline.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), disciplineController.getAll);
router.get('/types', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), disciplineController.getTypes);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR']), disciplineController.getById);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), disciplineController.create);
router.put('/:id', autoriser(['DIRECTEUR']), disciplineController.update);
router.post('/:id/justif', autoriser(['DIRECTEUR']), disciplineController.addJustif);

module.exports = router;
