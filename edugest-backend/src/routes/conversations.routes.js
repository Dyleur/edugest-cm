const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT, ROLES.PARENT]));

router.get('/', conversationsController.list);
router.get('/:id/messages', conversationsController.getMessages);
router.post('/', conversationsController.create);
router.post('/get-or-create', conversationsController.getOrCreate);

module.exports = router;
