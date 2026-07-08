const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle.controllers');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser(['ADMIN', 'RESPONSABLE_ADMIN', 'DIRECTEUR', 'ENSEIGNANT']));

router.get('/', cycleController.getAllCycles);
router.get('/:id', cycleController.getCycleById);
router.post('/', cycleController.createCycle);
router.put('/:id', cycleController.updateCycle);
router.delete('/:id', cycleController.deleteCycle);

module.exports = router;