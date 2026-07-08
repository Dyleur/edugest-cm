const { Eleve, Classe, Cycle, Salle, Frequente, Note, Epreuve, Cours, Paiement, Discipline, Enseignant } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

const effectifs = async (req, res) => {
  try {
    const classes = await Classe.findAll({
      include: [
        { model: Cycle, attributes: ['libelle'] },
        { model: Salle, where: { actif: 1 }, required: false },
      ],
      attributes: ['idClasse', 'libelle'],
    });
    const result = [];
    for (const c of classes) {
      const salles = c.Salles || [];
      const salleIds = salles.map(s => s.idSalle);
      let count = 0;
      if (salleIds.length > 0) {
        count = await Frequente.count({
          where: { idSalle: { [Op.in]: salleIds } },
          distinct: true,
          col: 'matricule',
        });
      }
      result.push({ classe: c.libelle, cycle: c.Cycle?.libelle || '', effectif: count });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resultats = async (req, res) => {
  try {
    const eleves = await Eleve.findAll({ where: { actif: 1 } });
    const result = [];
    for (const e of eleves) {
      const notes = await Note.findAll({
        where: { matricule: e.matricule },
        include: [{ model: Epreuve, include: [{ model: Cours, attributes: ['coefficient'] }] }],
      });
      if (notes.length === 0) continue;
      let total = 0;
      let coeffTotal = 0;
      for (const n of notes) {
        const coef = n.Epreuve?.Cours?.coefficient || 1;
        total += (n.note || 0) * coef;
        coeffTotal += coef;
      }
      result.push({
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        moyenne: coeffTotal > 0 ? (total / coeffTotal).toFixed(2) : 0,
      });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const presences = async (req, res) => {
  try {
    const stats = await Frequente.findAll({
      attributes: ['matricule', [sequelize.fn('COUNT', sequelize.col('idFrequente')), 'total']],
      group: ['matricule'],
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const finances = async (req, res) => {
  try {
    const total = await Paiement.sum('montant') || 0;
    const count = await Paiement.count();
    const eleves = await Eleve.count({ where: { actif: 1 } });
    res.json({ success: true, data: { totalEncaissements: total, nombrePaiements: count, totalEleves: eleves } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const disciplineRapport = async (req, res) => {
  try {
    const rapports = await Discipline.findAll({
      include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: rapports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { effectifs, resultats, presences, finances, disciplineRapport };
