const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salle.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), salleController.getAll);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), salleController.create);
router.post('/:id/titulaire', autoriser(['ADMIN', 'DIRECTEUR']), salleController.setTitulaire);

module.exports = router;
