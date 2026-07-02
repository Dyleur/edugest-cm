const { Eleve, Classe, Cycle, Salle, Frequente, Evaluation, Cours, Paiement, Mode, Rapport, Discipline } = require('../models/index');
const { sequelize } = require('../models/index');

const effectifs = async (req, res) => {
  try {
    const classes = await Classe.findAll({
      include: [{ model: Cycle, attributes: ['libelle'] }, { model: Salle, where: { actif: 1 }, required: false }],
      attributes: ['idClasse', 'libelle']
    });
    const result = [];
    for (const c of classes) {
      const count = await Frequente.count({
        where: { idSalle: c.Salles.map(s => s.idSalle) },
        distinct: true, col: 'matricule'
      });
      result.push({ classe: c.libelle, cycle: c.Cycle?.libelle, effectif: count });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resultats = async (req, res) => {
  try {
    const { Eleve, Frequente } = require('../models/index');
    const eleves = await Eleve.findAll({ where: { actif: 1 } });
    const result = [];
    for (const e of eleves) {
      const evaluations = await Evaluation.findAll({
        where: { matricule: e.matricule },
        include: [{ model: Cours, attributes: ['coefficient'] }]
      });
      if (evaluations.length === 0) continue;
      let total = 0, coeff = 0;
      evaluations.forEach(ev => { total += ev.note * (ev.Cours?.coefficient || 1); coeff += (ev.Cours?.coefficient || 1); });
      result.push({ matricule: e.matricule, nom: e.nom, prenom: e.prenom, moyenne: coeff > 0 ? (total / coeff).toFixed(2) : 0 });
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
      group: ['matricule']
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
    const rapports = await Rapport.findAll({
      include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: rapports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { effectifs, resultats, presences, finances, disciplineRapport };
