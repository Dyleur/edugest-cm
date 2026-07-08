const express = require('express');
const router = express.Router();
const edtController = require('../controllers/edt.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT]));

router.get('/', edtController.getAll);
router.get('/classe/:id', edtController.getByClasse);
router.get('/cours/:id', edtController.getByCours);
router.post('/', edtController.create);
router.put('/:id', edtController.update);
router.delete('/:id', edtController.remove);

module.exports = router;
