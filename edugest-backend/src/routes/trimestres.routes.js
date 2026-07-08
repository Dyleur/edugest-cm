const express = require('express');
const router = express.Router();
const trimestresController = require('../controllers/trimestres.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR]));

router.get('/', trimestresController.getAll);
router.get('/:id', trimestresController.getById);
router.post('/', trimestresController.create);
router.put('/:id', trimestresController.update);
router.delete('/:id', trimestresController.remove);

module.exports = router;
