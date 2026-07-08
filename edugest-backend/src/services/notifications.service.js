const { Notification, Personne } = require('../models');
const { Op } = require('sequelize');

const getByDestinataire = async (idDestinataire, options = {}) => {
  const where = { idDestinataire };
  if (options.nonLu) where.lu = 0;
  return Notification.findAll({
    where,
    order: [['dateCreation', 'DESC']],
    limit: options.limit || 50,
  });
};

const getNonLuCount = async (idDestinataire) => {
  return Notification.count({
    where: { idDestinataire, lu: 0 },
  });
};

const getById = async (id) => {
  const notif = await Notification.findByPk(id);
  if (!notif) throw new Error('Notification introuvable');
  return notif;
};

const create = async (data) => {
  return Notification.create({
    idDestinataire: data.idDestinataire,
    typeDestinataire: data.typeDestinataire || 'PARENT',
    titre: data.titre,
    message: data.message || null,
    typeNotification: data.typeNotification || 'info',
    referenceType: data.referenceType || null,
    referenceId: data.referenceId || null,
    lu: 0,
    dateCreation: new Date(),
  });
};

const createForParent = async (idParent, titre, message, typeNotification = 'info', referenceType = null, referenceId = null) => {
  return create({
    idDestinataire: idParent,
    typeDestinataire: 'PARENT',
    titre,
    message,
    typeNotification,
    referenceType,
    referenceId,
  });
};

const markAsRead = async (id) => {
  const notif = await getById(id);
  await notif.update({ lu: 1, dateLecture: new Date() });
  return notif;
};

const markAllAsRead = async (idDestinataire) => {
  await Notification.update(
    { lu: 1, dateLecture: new Date() },
    { where: { idDestinataire, lu: 0 } }
  );
};

const remove = async (id) => {
  const notif = await getById(id);
  await notif.destroy();
};

const removeAll = async (idDestinataire) => {
  await Notification.destroy({ where: { idDestinataire } });
};

module.exports = {
  getByDestinataire, getNonLuCount, getById,
  create, createForParent,
  markAsRead, markAllAsRead,
  remove, removeAll,
};
