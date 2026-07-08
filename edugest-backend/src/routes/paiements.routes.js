const express = require('express');
const router = express.Router();
const paiementsController = require('../controllers/paiements.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.PARENT]));

router.get('/', paiementsController.getAll);
router.get('/stats', paiementsController.getStats);
router.get('/impayes', paiementsController.getImpayes);
router.get('/:id', paiementsController.getById);
router.post('/', paiementsController.create);
router.put('/:id', paiementsController.update);
router.delete('/:id', paiementsController.remove);

module.exports = router;
