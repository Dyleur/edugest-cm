const { Paiement, Mode, Eleve, AnneeAcademique, Scolarite, Tranches, Cycle } = require('../models/index');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  try {
    const paiements = await Paiement.findAll({
      include: [{ model: Mode, attributes: ['libelle'] }, { model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
      order: [['dateEnregistrer', 'DESC']]
    });
    res.json({ success: true, data: paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id, {
      include: [{ model: Mode }, { model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }]
    });
    if (!paiement) return res.status(404).json({ success: false, message: 'Paiement introuvable' });
    res.json({ success: true, data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { matricule, idAca, montant, typePaiement, trimestre, idMode, operation_ID, datePaie } = req.body;
    if (!matricule || !montant || !idMode) {
      return res.status(400).json({ success: false, message: 'matricule, montant et idMode requis' });
    }
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève introuvable' });
    const comentaire = typePaiement ? `${typePaiement}-${trimestre || ''}` : 'AUTRE';
    const paiement = await Paiement.create({
      matricule, idAca, montant, idMode, operation_ID, datePaie: datePaie || new Date(),
      comentaire, idPers: req.user?.id, dateEnregistrer: new Date()
    });
    res.status(201).json({ success: true, message: 'Paiement enregistré', data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) return res.status(404).json({ success: false, message: 'Paiement introuvable' });
    await paiement.update(req.body);
    res.json({ success: true, message: 'Paiement modifié', data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) return res.status(404).json({ success: false, message: 'Paiement introuvable' });
    await paiement.destroy();
    res.json({ success: true, message: 'Paiement annulé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByEleve = async (req, res) => {
  try {
    const paiements = await Paiement.findAll({
      where: { matricule: req.params.matricule },
      include: [{ model: Mode, attributes: ['libelle'] }],
      order: [['dateEnregistrer', 'DESC']]
    });
    res.json({ success: true, data: paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getImpayes = async (req, res) => {
  try {
    const eleves = await Eleve.findAll({ where: { actif: 1 }, include: [{ model: Paiement }] });
    const impayes = eleves.filter(e => !e.Paiements || e.Paiements.length === 0);
    res.json({ success: true, data: impayes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await Paiement.sum('montant');
    const count = await Paiement.count();
    res.json({ success: true, data: { total, count, moyenne: count > 0 ? total / count : 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove, getByEleve, getImpayes, getStats };
