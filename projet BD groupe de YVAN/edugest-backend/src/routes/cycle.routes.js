const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle.controllers');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), cycleController.getAllCycles);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN', 'PARENT']), cycleController.getCycleById);
router.post('/', autoriser(['ADMIN']), cycleController.createCycle);
router.put('/:id', autoriser(['ADMIN']), cycleController.updateCycle);
router.delete('/:id', autoriser(['ADMIN']), cycleController.deleteCycle);

module.exports = router;
