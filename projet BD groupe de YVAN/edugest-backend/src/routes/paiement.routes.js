const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), paiementController.getAll);
router.get('/impayes', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), paiementController.getImpayes);
router.get('/stats', autoriser(['ADMIN', 'DIRECTEUR']), paiementController.getStats);
router.get('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN']), paiementController.getById);
router.post('/', autoriser(['RESPONSABLE_ADMIN', 'DIRECTEUR']), paiementController.create);
router.put('/:id', autoriser(['RESPONSABLE_ADMIN', 'DIRECTEUR']), paiementController.update);
router.delete('/:id', autoriser(['ADMIN', 'DIRECTEUR']), paiementController.remove);

module.exports = router;
