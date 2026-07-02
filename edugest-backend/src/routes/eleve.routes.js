const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleve.controller');

router.get('/', eleveController.getAllEleves);
router.get('/:matricule', eleveController.getEleveById);
router.post('/', eleveController.createEleve);
router.put('/:matricule', eleveController.updateEleve);
router.delete('/:matricule', eleveController.deleteEleve);

module.exports = router;