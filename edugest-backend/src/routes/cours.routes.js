const express = require('express');
const router = express.Router();
const coursController = require('../controllers/cours.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR]));

router.get('/', coursController.getAll);
router.get('/:id', coursController.getById);
router.post('/', coursController.create);
router.put('/:id', coursController.update);
router.delete('/:id', coursController.remove);

module.exports = router;
