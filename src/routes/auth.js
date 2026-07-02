const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Route de connexion — POST /api/auth/login
// Pour l'instant on simule avec des utilisateurs fictifs
// Plus tard on connectera à la vraie table Personne
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Utilisateurs de test (on remplacera par la DB plus tard)
  const utilisateurs = [
    { id: 1, username: 'admin', password: 'admin123', role: 'ADMIN', nom: 'Administrateur' },
    { id: 2, username: 'enseignant1', password: 'ens123', role: 'ENSEIGNANT', nom: 'Prof Dupont' },
    { id: 3, username: 'parent1', password: 'par123', role: 'PARENT', nom: 'Parent Martin' },
  ];

  // Cherche l'utilisateur
  const user = utilisateurs.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: 'Identifiants incorrects.'
    });
  }

  // Génère le token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, nom: user.nom }, // payload
    process.env.JWT_SECRET,                           // clé secrète
    { expiresIn: process.env.JWT_EXPIRES_IN }         // expiration : 24h
  );

  res.json({
    status: 200,
    message: 'Connexion réussie',
    token,
    user: { id: user.id, nom: user.nom, role: user.role }
  });
});

module.exports = router;