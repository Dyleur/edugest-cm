const jwt = require('jsonwebtoken');

// Ce middleware vérifie que chaque requête contient un token JWT valide
const verifyToken = (req, res, next) => {

  // 1. Récupère le token dans le header "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrait juste le token

  // 2. Si pas de token → accès refusé
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'Accès refusé. Token manquant.'
    });
  }

  // 3. Vérifie que le token est valide et non expiré
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les infos de l'utilisateur à la requête
    next(); // Passe à la route suivante
  } catch (error) {
    return res.status(403).json({
      status: 403,
      message: 'Token invalide ou expiré.'
    });
  }
};

module.exports = { verifyToken };