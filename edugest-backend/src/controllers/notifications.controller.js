const notificationsService = require('../services/notifications.service');

const getMesNotifications = async (req, res) => {
  try {
    const nonLu = req.query.nonLu === 'true';
    const notifications = await notificationsService.getByDestinataire(req.user.idPers, { nonLu });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNonLuCount = async (req, res) => {
  try {
    const count = await notificationsService.getNonLuCount(req.user.idPers);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const notif = await notificationsService.getById(req.params.id);
    res.json({ success: true, data: notif });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const notif = await notificationsService.create(req.body);
    res.status(201).json({ success: true, message: 'Notification créée', data: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notif = await notificationsService.markAsRead(req.params.id);
    res.json({ success: true, message: 'Notification marquée comme lue', data: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationsService.markAllAsRead(req.user.idPers);
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await notificationsService.remove(req.params.id);
    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMesNotifications, getNonLuCount, getById, create, markAsRead, markAllAsRead, remove };
