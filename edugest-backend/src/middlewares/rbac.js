const ROLES = {
  ADMIN: 'ADMIN',
  DIRECTEUR: 'DIRECTEUR',
  ENSEIGNANT: 'ENSEIGNANT',
  SECRETAIRE: 'SECRETAIRE',
  PARENT: 'PARENT'
};

const autoriser = (rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Non authentifié.'
      });
    }

    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message: `Accès refusé. Rôle requis : ${rolesAutorises.join(' ou ')}`
      });
    }

    next();
  };
};

module.exports = { autoriser, ROLES };
