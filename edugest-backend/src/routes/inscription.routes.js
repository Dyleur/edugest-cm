const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscription.controller');

// Liste toutes les inscriptions
router.get('/', inscriptionController.getAllInscriptions);

// Historique des inscriptions d'un élève
router.get('/eleve/:matricule', inscriptionController.getInscriptionsByEleve);

// Inscrire un élève
router.post('/', inscriptionController.inscrireEleve);

// Modifier une inscription
router.put('/:id', inscriptionController.updateInscription);

// Annuler une inscription
router.delete('/:id', inscriptionController.deleteInscription);

module.exports = router;