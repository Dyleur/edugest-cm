const { Evaluation, Epreuve, Cours, Session } = require('../models/index');

// Saisir une note
const saisirNote = async (req, res) => {
  try {
    const { note, appreciation, matricule, idEpreuve, idCours, idSession } = req.body;

    // Validation
    if (!note || !matricule || !idEpreuve || !idCours || !idSession) {
      return res.status(400).json({
        status: 400,
        message: 'Tous les champs sont obligatoires.'
      });
    }

    if (note < 0 || note > 20) {
      return res.status(400).json({
        status: 400,
        message: 'La note doit être entre 0 et 20.'
      });
    }

    // Vérifie si une note existe déjà pour cet élève/épreuve
    const existeDeja = await Evaluation.findOne({
      where: { matricule, idEpreuve }
    });

    if (existeDeja) {
      return res.status(409).json({
        status: 409,
        message: 'Une note existe déjà pour cet élève à cette épreuve.'
      });
    }

    const evaluation = await Evaluation.create({
      note,
      appreciation,
      matricule,
      idEpreuve,
      idCours,
      idSession,
      idPers: req.user.id
    });

    res.status(201).json({
      status: 201,
      message: 'Note saisie avec succès',
      data: evaluation
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Obtenir toutes les notes d'un élève
const notesEleve = async (req, res) => {
  try {
    const { matricule } = req.params;

    const evaluations = await Evaluation.findAll({
      where: { matricule },
      include: [
        { model: Epreuve, attributes: ['libelle'] },
        { model: Cours, attributes: ['libelle', 'coefficient'] },
        { model: Session, attributes: ['libelle'] }
      ]
    });

    res.json({
      status: 200,
      data: evaluations
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Modifier une note
const modifierNote = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        status: 404,
        message: 'Évaluation non trouvée.'
      });
    }

    if (req.body.note && (req.body.note < 0 || req.body.note > 20)) {
      return res.status(400).json({
        status: 400,
        message: 'La note doit être entre 0 et 20.'
      });
    }

    await evaluation.update(req.body);

    res.json({
      status: 200,
      message: 'Note modifiée avec succès',
      data: evaluation
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = { saisirNote, notesEleve, modifierNote };