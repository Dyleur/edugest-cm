const { Epreuve, NatureEpreuve } = require('../models/index');

// Créer une épreuve
const creerEpreuve = async (req, res) => {
  try {
    const { libelle, idNature, auteur, urlDoc } = req.body;

    // Validation
    if (!libelle || !idNature) {
      return res.status(400).json({
        status: 400,
        message: 'Le libellé et la nature sont obligatoires.'
      });
    }

    const epreuve = await Epreuve.create({
      libelle,
      idNature,
      auteur,
      urlDoc,
      idPers: req.user.id  // enseignant connecté
    });

    res.status(201).json({
      status: 201,
      message: 'Épreuve créée avec succès',
      data: epreuve
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

// Lister toutes les épreuves
const listerEpreuves = async (req, res) => {
  try {
    const epreuves = await Epreuve.findAll({
      include: [{
        model: NatureEpreuve,
        attributes: ['libelle']  // inclut le nom de la nature
      }]
    });

    res.json({
      status: 200,
      data: epreuves
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

// Obtenir une épreuve par son ID
const obtenirEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id, {
      include: [NatureEpreuve]
    });

    if (!epreuve) {
      return res.status(404).json({
        status: 404,
        message: 'Épreuve non trouvée.'
      });
    }

    res.json({ status: 200, data: epreuve });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Modifier une épreuve
const modifierEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);

    if (!epreuve) {
      return res.status(404).json({
        status: 404,
        message: 'Épreuve non trouvée.'
      });
    }

    await epreuve.update(req.body);

    res.json({
      status: 200,
      message: 'Épreuve modifiée avec succès',
      data: epreuve
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Supprimer une épreuve
const supprimerEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);

    if (!epreuve) {
      return res.status(404).json({
        status: 404,
        message: 'Épreuve non trouvée.'
      });
    }

    await epreuve.destroy();

    res.json({
      status: 200,
      message: 'Épreuve supprimée avec succès'
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  creerEpreuve,
  listerEpreuves,
  obtenirEpreuve,
  modifierEpreuve,
  supprimerEpreuve
};