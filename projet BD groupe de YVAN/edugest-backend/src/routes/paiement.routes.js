const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), paiementController.getAll);
router.get('/impayes', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), paiementController.getImpayes);
router.get('/stats', autoriser(['ADMIN', 'DIRECTEUR']), paiementController.getStats);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'SECRETAIRE']), paiementController.getById);
router.post('/', autoriser(['SECRETAIRE', 'DIRECTEUR']), paiementController.create);
router.put('/:id', autoriser(['SECRETAIRE', 'DIRECTEUR']), paiementController.update);
router.delete('/:id', autoriser(['ADMIN', 'DIRECTEUR']), paiementController.remove);

module.exports = router;
