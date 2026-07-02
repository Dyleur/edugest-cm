const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const {
  creerEpreuve,
  listerEpreuves,
  obtenirEpreuve,
  modifierEpreuve,
  supprimerEpreuve
} = require('../controllers/epreuveController');

// Toutes les routes nécessitent un token JWT
router.use(verifyToken);

// GET /api/epreuves — liste toutes les épreuves
router.get('/', listerEpreuves);

// GET /api/epreuves/:id — obtenir une épreuve
router.get('/:id', obtenirEpreuve);

// POST /api/epreuves — créer une épreuve (ADMIN, DIRECTEUR, ENSEIGNANT)
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), creerEpreuve);

// PUT /api/epreuves/:id — modifier une épreuve (ADMIN, DIRECTEUR)
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR']), modifierEpreuve);

// DELETE /api/epreuves/:id — supprimer (ADMIN seulement)
router.delete('/:id', autoriser(['ADMIN']), supprimerEpreuve);

module.exports = router;