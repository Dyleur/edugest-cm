const bulletinsService = require('../services/bulletins.service');

const getAll = async (req, res) => {
  try {
    const bulletins = await bulletinsService.getAll();
    res.json({ success: true, data: bulletins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByEleve = async (req, res) => {
  try {
    const bulletin = await bulletinsService.getByEleve(req.params.matricule, req.params.idSession);
    res.json({ success: true, data: bulletin });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getByClasse = async (req, res) => {
  try {
    const bulletins = await bulletinsService.getByClasse(req.params.id, req.query.idSession);
    res.json({ success: true, data: bulletins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMoyenne = async (req, res) => {
  try {
    const moyenne = await bulletinsService.getMoyenne(req.params.matricule, req.params.idSession);
    res.json({ success: true, data: moyenne });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getByEleve, getByClasse, getMoyenne };
