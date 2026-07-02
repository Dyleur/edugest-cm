const express = require('express');
const router = express.Router();
const trimestreController = require('../controllers/trimestre.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'SECRETAIRE', 'PARENT']), trimestreController.getAll);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'SECRETAIRE', 'PARENT']), trimestreController.getById);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), trimestreController.create);

module.exports = router;
