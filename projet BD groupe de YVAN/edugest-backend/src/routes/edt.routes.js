const express = require('express');
const router = express.Router();
const edt = require('../controllers/edt.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), edt.getAll);
router.get('/classe/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), edt.getByClasse);
router.get('/cours/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), edt.getByCours);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), edt.create);
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR']), edt.update);
router.delete('/:id', autoriser(['ADMIN', 'DIRECTEUR']), edt.remove);

module.exports = router;
