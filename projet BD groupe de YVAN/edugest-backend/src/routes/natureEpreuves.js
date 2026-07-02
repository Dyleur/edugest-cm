const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { autoriser } = require('../middlewares/rbac');
const { creer, lister } = require('../controllers/natureEpreuveController');

router.use(verifyToken);

router.get('/', lister);
router.post('/', autoriser(['ADMIN', 'DIRECTEUR']), creer);

module.exports = router;