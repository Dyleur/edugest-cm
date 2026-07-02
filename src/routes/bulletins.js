const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { calculerMoyenne, genererBulletin } = require('../services/bulletinService');

router.use(verifyToken);

// GET /api/bulletins/:matricule/:idSession — bulletin complet
router.get('/:matricule/:idSession', async (req, res) => {
  try {
    const { matricule, idSession } = req.params;
    const bulletin = await genererBulletin(matricule, idSession);

    if (!bulletin) {
      return res.status(404).json({
        status: 404,
        message: 'Aucune note trouvée pour cet élève.'
      });
    }

    res.json({ status: 200, data: bulletin });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET /api/bulletins/moyenne/:matricule/:idSession — moyenne seule
router.get('/moyenne/:matricule/:idSession', async (req, res) => {
  try {
    const { matricule, idSession } = req.params;
    const moyenne = await calculerMoyenne(matricule, idSession);

    res.json({
      status: 200,
      data: { matricule, idSession, moyenne }
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;