const { Messages, Personne } = require('../models/index');

// Envoyer un message
const envoyerMessage = async (req, res) => {
  try {
    const { idParent, objet, information, type_message, AnneeAcade } = req.body;

    // Validation
    if (!objet || !information) {
      return res.status(400).json({
        status: 400,
        message: 'L\'objet et le contenu sont obligatoires.'
      });
    }

    const message = await Messages.create({
      idExp_Pers: req.user.id,  // expéditeur = utilisateur connecté
      idParent,
      objet,
      information,
      type_message,
      AnneeAcade,
      valider: false            // non validé par défaut
    });

    res.status(201).json({
      status: 201,
      message: 'Message envoyé avec succès',
      data: message
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Lister tous les messages envoyés par l'utilisateur connecté
const mesMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      where: { idExp_Pers: req.user.id },
      order: [['createdAt', 'DESC']]  // plus récents en premier
    });

    res.json({
      status: 200,
      data: messages
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Lister tous les messages (ADMIN et DIRECTEUR seulement)
const tousLesMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [{
        model: Personne,
        as: 'expediteur',
        attributes: ['nom', 'prenom']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 200,
      data: messages
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Valider un message (DIRECTEUR seulement)
const validerMessage = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 404,
        message: 'Message non trouvé.'
      });
    }

    await message.update({ valider: true });

    res.json({
      status: 200,
      message: 'Message validé avec succès',
      data: message
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Supprimer un message
const supprimerMessage = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 404,
        message: 'Message non trouvé.'
      });
    }

    // Seul l'expéditeur ou un admin peut supprimer
    if (message.idExp_Pers !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 403,
        message: 'Vous ne pouvez pas supprimer ce message.'
      });
    }

    await message.destroy();

    res.json({
      status: 200,
      message: 'Message supprimé avec succès'
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Obtenir un message par ID
const obtenirMessage = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id, {
      include: [{
        model: Personne,
        as: 'expediteur',
        attributes: ['nom', 'prenom']
      }]
    });

    if (!message) {
      return res.status(404).json({
        status: 404,
        message: 'Message non trouvé.'
      });
    }

    res.json({ status: 200, data: message });

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  envoyerMessage,
  mesMessages,
  tousLesMessages,
  validerMessage,
  supprimerMessage,
  obtenirMessage
};