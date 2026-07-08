const express = require('express');
const router = express.Router();
const sallesController = require('../controllers/salles.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR]));

router.get('/', sallesController.getAll);
router.get('/:id', sallesController.getById);
router.post('/', sallesController.create);
router.put('/:id', sallesController.update);
router.delete('/:id', sallesController.remove);
router.post('/:id/titulaire', sallesController.setTitulaire);

module.exports = router;
