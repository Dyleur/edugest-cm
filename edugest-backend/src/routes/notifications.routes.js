const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/mes-notifications', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.getMesNotifications);
router.get('/non-lu', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.getNonLuCount);
router.patch('/lire-tout', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.markAllAsRead);
router.post('/', autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR]), notificationsController.create);
router.get('/:id', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.getById);
router.patch('/:id/lire', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.markAsRead);
router.delete('/:id', autoriser([ROLES.PARENT, ROLES.ADMIN, ROLES.ENSEIGNANT, ROLES.DIRECTEUR, ROLES.RESPONSABLE_ADMIN]), notificationsController.remove);

module.exports = router;
