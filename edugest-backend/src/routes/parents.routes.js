const express = require('express');
const router = express.Router();
const parentsController = require('../controllers/parents.controller');

router.get('/:idParent/enfants', parentsController.getEnfants);

module.exports = router;
