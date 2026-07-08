const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Personne, Enseignant, Parents } = require('../models');

const checkAdmin = async (username) => {
  const admin = await Admin.findOne({ where: { username, actif: 1 } });
  return admin;
};

const checkPersonne = async (username) => {
  const personne = await Personne.findOne({ where: { username } });
  return personne;
};

const getRoleFromType = (typePersonne) => {
  const roleMap = {
    1: 'ENSEIGNANT',
    2: 'DIRECTEUR',
    3: 'RESPONSABLE_ADMIN',
    4: 'PARENT'
  };
  return roleMap[typePersonne] || null;
};

const login = async (username, password) => {
  let user = null;
  let role = null;
  let idPers = null;
  let typePersonne = null;
  let nom = '';
  let prenom = '';

  const admin = await checkAdmin(username);
  if (admin) {
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw { status: 401, message: 'Identifiants incorrects.' };
    }
    idPers = admin.ID;
    role = 'ADMIN';
    nom = admin.nom;
    prenom = '';
    typePersonne = null;
  } else {
    const personne = await checkPersonne(username);
    if (!personne) {
      throw { status: 401, message: 'Identifiants incorrects.' };
    }
    const valid = await bcrypt.compare(password, personne.password);
    if (!valid) {
      throw { status: 401, message: 'Identifiants incorrects.' };
    }
    idPers = personne.idPers;
    role = getRoleFromType(personne.typePersonne);
    nom = personne.nom;
    prenom = personne.prenom;
    typePersonne = personne.typePersonne;
    if (!role) {
      throw { status: 403, message: 'Type de compte non reconnu.' };
    }
  }

  const tokenPayload = { idPers, username, role, typePersonne };
  if (role === 'ADMIN') {
    tokenPayload.idPers = admin.ID;
    tokenPayload.typePersonne = null;
  }

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return {
    token,
    user: {
      idPers,
      nom: role === 'ADMIN' ? nom : `${prenom} ${nom}`,
      role,
      typePersonne
    }
  };
};

const getMe = async (userId, role) => {
  if (role === 'ADMIN') {
    const admin = await Admin.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!admin) throw { status: 404, message: 'Compte introuvable.' };
    return { ...admin.toJSON(), role: 'ADMIN' };
  }

  const personne = await Personne.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!personne) throw { status: 404, message: 'Compte introuvable.' };
  return { ...personne.toJSON(), role: getRoleFromType(personne.typePersonne) };
};

const changePassword = async (userId, role, oldPassword, newPassword) => {
  if (role === 'ADMIN') {
    const admin = await Admin.findByPk(userId);
    if (!admin) throw { status: 404, message: 'Compte introuvable.' };
    const valid = await bcrypt.compare(oldPassword, admin.password);
    if (!valid) throw { status: 400, message: 'Ancien mot de passe incorrect.' };
    const hashed = await bcrypt.hash(newPassword, 10);
    await admin.update({ password: hashed });
    return { message: 'Mot de passe modifié avec succès.' };
  }

  const personne = await Personne.findByPk(userId);
  if (!personne) throw { status: 404, message: 'Compte introuvable.' };
  const valid = await bcrypt.compare(oldPassword, personne.password);
  if (!valid) throw { status: 400, message: 'Ancien mot de passe incorrect.' };
  const hashed = await bcrypt.hash(newPassword, 10);
  await personne.update({ password: hashed });
  return { message: 'Mot de passe modifié avec succès.' };
};

module.exports = { login, getMe, changePassword };
