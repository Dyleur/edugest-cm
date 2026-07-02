const express = require('express');
const router = express.Router();
const anneeController = require('../controllers/annee.controller');

// GET    /api/annees        → liste toutes les années
router.get('/', anneeController.getAllAnnees);

// GET    /api/annees/:id    → détails d'une année
router.get('/:id', anneeController.getAnneeById);

// POST   /api/annees        → créer une année
router.post('/', anneeController.createAnnee);

// PUT    /api/annees/:id    → modifier une année
router.put('/:id', anneeController.updateAnnee);

// DELETE /api/annees/:id    → supprimer une année
router.delete('/:id', anneeController.deleteAnnee);

module.exports = router;