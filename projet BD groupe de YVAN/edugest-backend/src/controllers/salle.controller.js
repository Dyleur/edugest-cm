const { Salle, Classe, Cycle, Titulaire, Personne } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const salles = await Salle.findAll({
      where: { actif: 1 },
      include: [{ model: Classe, include: [{ model: Cycle, attributes: ['libelle'] }] }]
    });
    res.json({ success: true, data: salles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { libelle, position, surface, idClasse } = req.body;
    if (!libelle || !idClasse) return res.status(400).json({ success: false, message: 'libelle et idClasse requis' });
    const salle = await Salle.create({ libelle, position, surface, idClasse, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Salle créée', data: salle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setTitulaire = async (req, res) => {
  try {
    const { idPers } = req.body;
    const salle = await Salle.findByPk(req.params.id);
    if (!salle) return res.status(404).json({ success: false, message: 'Salle introuvable' });
    const titulaire = await Titulaire.create({ idPers, idSalle: req.params.id, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Titulaire affecté', data: titulaire });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, setTitulaire };
