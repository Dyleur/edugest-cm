const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'PARENT']));

router.get('/stats', dashboardController.getStats);

module.exports = router;
