const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Personne, sequelize } = require('../models/index');
const { verifyToken } = require('../middlewares/auth');

const ROLE_MAP = { 1: 'ENSEIGNANT', 2: 'DIRECTEUR', 3: 'RESPONSABLE_ADMIN', 4: 'PARENT' };

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    const personne = await Personne.findOne({ where: { username } });
    if (!personne) {
      return res.status(401).json({ status: 401, message: 'Identifiants incorrects.' });
    }

    const valid = await bcrypt.compare(password, personne.password);
    if (!valid) {
      return res.status(401).json({ status: 401, message: 'Identifiants incorrects.' });
    }

    let role = ROLE_MAP[personne.typePersonne] || 'ENSEIGNANT';
    if (username === 'admin') role = 'ADMIN';

    const token = jwt.sign(
      { id: personne.idPers, role, nom: personne.nom, prenom: personne.prenom, typePersonne: personne.typePersonne },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      status: 200, message: 'Connexion réussie', token,
      user: { idPers: personne.idPers, role, typePersonne: personne.typePersonne, nom: personne.nom, prenom: personne.prenom }
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const personne = await Personne.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!personne) return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' });
    const role = ROLE_MAP[personne.typePersonne] || 'ENSEIGNANT';
    res.json({ status: 200, data: { ...personne.toJSON(), role } });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.patch('/password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const personne = await Personne.findByPk(req.user.id);
    if (!personne) return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' });
    const valid = await bcrypt.compare(oldPassword, personne.password);
    if (!valid) return res.status(400).json({ status: 400, message: 'Ancien mot de passe incorrect' });
    personne.password = await bcrypt.hash(newPassword, 10);
    await personne.save();
    res.json({ status: 200, message: 'Mot de passe modifié' });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
