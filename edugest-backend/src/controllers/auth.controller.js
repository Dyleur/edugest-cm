const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Le nom d\'utilisateur et le mot de passe sont requis.'
      });
    }
    const result = await authService.login(username, password);
    res.json({
      status: 200,
      message: 'Connexion réussie',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      status,
      message: error.message || 'Erreur lors de la connexion.'
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({
      status: 200,
      message: 'Déconnexion réussie.'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Erreur lors de la déconnexion.'
    });
  }
};

const me = async (req, res) => {
  try {
    const profile = await authService.getMe(req.user.idPers, req.user.role);
    res.json({
      status: 200,
      data: profile
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      status,
      message: error.message || 'Erreur lors de la récupération du profil.'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: 'L\'ancien et le nouveau mot de passe sont requis.'
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 400,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.'
      });
    }
    const result = await authService.changePassword(
      req.user.idPers,
      req.user.role,
      oldPassword,
      newPassword
    );
    res.json({
      status: 200,
      message: result.message
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      status,
      message: error.message || 'Erreur lors du changement de mot de passe.'
    });
  }
};

module.exports = { login, logout, me, changePassword };
