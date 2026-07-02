const { NatureEpreuve } = require('../models/index');

const creer = async (req, res) => {
  try {
    const { libelle, description } = req.body;

    if (!libelle) {
      return res.status(400).json({
        status: 400,
        message: 'Le libellé est obligatoire.'
      });
    }

    const nature = await NatureEpreuve.create({ libelle, description });

    res.status(201).json({
      status: 201,
      message: 'Nature créée avec succès',
      data: nature
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const lister = async (req, res) => {
  try {
    const natures = await NatureEpreuve.findAll();
    res.json({ status: 200, data: natures });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = { creer, lister };