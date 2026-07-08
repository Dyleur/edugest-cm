const express = require('express');
const router = express.Router();
const scolariteController = require('../controllers/scolarite.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), scolariteController.getAll);
router.post('/', autoriser(['ADMIN']), scolariteController.create);
router.get('/:id/tranches', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), scolariteController.getTranches);
router.post('/:id/tranches', autoriser(['ADMIN']), scolariteController.createTranche);

module.exports = router;
