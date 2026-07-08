const express = require('express');
const router = express.Router();
const coursController = require('../controllers/cours.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), coursController.getAll);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), coursController.getById);
router.post('/', autoriser(['ADMIN']), coursController.create);
router.put('/:id', autoriser(['ADMIN']), coursController.update);

module.exports = router;
