const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const {
  envoyerMessage,
  mesMessages,
  tousLesMessages,
  validerMessage,
  supprimerMessage,
  obtenirMessage
} = require('../controllers/messageController');

// Toutes les routes nécessitent un token
router.use(verifyToken);

// POST /api/messages — envoyer un message
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT', 'RESPONSABLE_ADMIN']), envoyerMessage);

// GET /api/messages/mes-messages — mes messages envoyés
router.get('/mes-messages', mesMessages);

// GET /api/messages — tous les messages (ADMIN, DIRECTEUR)
router.get('/', autoriser(['ADMIN', 'DIRECTEUR']), tousLesMessages);

// GET /api/messages/:id — un message précis
router.get('/:id', obtenirMessage);

// PATCH /api/messages/:id/valider — valider un message
router.patch('/:id/valider', autoriser(['ADMIN', 'DIRECTEUR']), validerMessage);

// DELETE /api/messages/:id — supprimer un message
router.delete('/:id', supprimerMessage);

module.exports = router;