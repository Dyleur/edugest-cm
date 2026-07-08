const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), sessionController.getAll);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), sessionController.getById);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), sessionController.create);

module.exports = router;
