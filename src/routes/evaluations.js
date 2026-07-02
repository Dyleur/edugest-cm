const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const { saisirNote, notesEleve, modifierNote } = require('../controllers/evaluationController');

router.use(verifyToken);

// POST /api/evaluations — saisir une note
router.post('/', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), saisirNote);

// GET /api/evaluations/eleve/:matricule — notes d'un élève
router.get('/eleve/:matricule', notesEleve);

// PUT /api/evaluations/:id — modifier une note
router.put('/:id', autoriser(['ADMIN', 'DIRECTEUR', 'ENSEIGNANT']), modifierNote);

module.exports = router;