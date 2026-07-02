const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence.controller');

// Marquer présent
router.put('/present', presenceController.marquerPresent);

// Marquer absent
router.put('/absent', presenceController.marquerAbsent);

// Présences d'une salle pour une année
router.get(
  '/salle/:idSalle/annee/:idAcademi',
  presenceController.getPresencesBySalle
);

// Absences d'un élève
router.get(
  '/eleve/:matricule/absences',
  presenceController.getAbsencesByEleve
);

// Statistiques d'une salle
router.get(
  '/stats/salle/:idSalle/annee/:idAcademi',
  presenceController.getStatistiquesBySalle
);

module.exports = router;