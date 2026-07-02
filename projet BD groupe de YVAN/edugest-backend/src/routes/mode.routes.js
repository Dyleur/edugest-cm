const express = require('express');
const router = express.Router();
const modeController = require('../controllers/mode.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE', 'ENSEIGNANT', 'PARENT']), modeController.getAll);

module.exports = router;
