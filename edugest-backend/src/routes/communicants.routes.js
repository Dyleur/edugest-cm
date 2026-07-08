const express = require('express');
const router = express.Router();
const communicantsController = require('../controllers/communicants.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']));

router.get('/', communicantsController.getAll);

module.exports = router;
