// RBAC = Role Based Access Control
// Ce middleware vérifie que l'utilisateur a le bon rôle pour accéder à une route

// Les 5 rôles de l'application EduGest
const ROLES = {
  ADMIN: 'ADMIN',
  DIRECTEUR: 'DIRECTEUR',
  ENSEIGNANT: 'ENSEIGNANT',
  RESPONSABLE_ADMIN: 'RESPONSABLE_ADMIN',
  PARENT: 'PARENT'
};

// Fonction qui génère un middleware selon les rôles autorisés
// Exemple d'utilisation : autoriser(['ADMIN', 'DIRECTEUR'])
const autoriser = (rolesAutorises) => {
  return (req, res, next) => {

    // req.user a été ajouté par le middleware verifyToken
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Non authentifié.'
      });
    }

    // Vérifie si le rôle de l'utilisateur est dans la liste des rôles autorisés
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message: `Accès refusé. Rôle requis : ${rolesAutorises.join(' ou ')}`
      });
    }

    next(); // Rôle OK → on continue
  };
};

module.exports = { autoriser, ROLES };