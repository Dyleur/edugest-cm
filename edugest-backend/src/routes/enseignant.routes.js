const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignant.controller');

router.get('/', enseignantController.getAllEnseignants);
router.get('/:id', enseignantController.getEnseignantById);
router.get('/:id/classes', enseignantController.getClassesByEnseignant);
router.post('/', enseignantController.createEnseignant);
router.put('/:id', enseignantController.updateEnseignant);
router.delete('/:id', enseignantController.deleteEnseignant);

module.exports = router;