const express = require('express');
const router = express.Router();
const epreuvesController = require('../controllers/epreuves.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]));

router.get('/', epreuvesController.getAll);
router.get('/:id', epreuvesController.getById);
router.post('/', epreuvesController.create);
router.put('/:id', epreuvesController.update);
router.delete('/:id', epreuvesController.remove);

module.exports = router;
