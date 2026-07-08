const annoncesService = require('../services/annonces.service');

const list = async (req, res) => {
  try {
    const annonces = await annoncesService.getAll(req.user.role);
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const annonce = await annoncesService.getById(req.params.id);
    res.json(annonce);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const annonce = await annoncesService.create({
      titre: req.body.titre,
      contenu: req.body.contenu,
      auteurId: req.user.idPers,
      auteurNom: (req.user.nom || '') + ' ' + (req.user.prenom || ''),
      auteurRole: req.user.role,
      fichierUrl: req.body.fichierUrl,
      fichierNom: req.body.fichierNom,
      fichierTaille: req.body.fichierTaille,
      cibleRoles: req.body.cibleRoles || 'ALL',
    });
    res.status(201).json(annonce);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
    const fileUrl = '/uploads/annonces/' + req.file.filename;
    res.json({
      success: true,
      data: {
        fichierUrl: fileUrl,
        fichierNom: req.file.originalname,
        fichierTaille: req.file.size,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await annoncesService.remove(req.params.id, req.user.idPers);
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = { list, getOne, create, uploadFile, remove };
