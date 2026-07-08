const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Message, Conversation, ConversationParticipant, Personne, Admin } = require('../models');
const notificationsService = require('../services/notifications.service');

const onlineUsers = new Map();

function setupSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Token manquant'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', async (socket) => {
    const { idPers, role, username } = socket.user;
    const userId = idPers;

    onlineUsers.set(userId, { socketId: socket.id, role, username, lastSeen: new Date() });

    socket.join(`user:${userId}`);
    io.emit('users:online', Array.from(onlineUsers.keys()));

    const convs = await ConversationParticipant.findAll({
      where: { idUser: userId },
      attributes: ['idConversation'],
    });
    convs.forEach(c => socket.join(`conv:${c.idConversation}`));

    socket.on('conversations:join', (convIds) => {
      if (Array.isArray(convIds)) convIds.forEach(id => socket.join(`conv:${id}`));
    });

    socket.on('messages:send', async (data, callback) => {
      try {
        const { conversationId, contenu, fichierUrl, fichierNom } = data;
        if (!conversationId || !contenu?.trim()) {
          return callback?.({ error: 'conversationId et contenu requis' });
        }

        const participant = await ConversationParticipant.findOne({
          where: { idConversation: conversationId, idUser: userId },
        });
        if (!participant) return callback?.({ error: 'Accès refusé' });

        const message = await Message.create({
          expediteurId: userId,
          expediteurType: role === 'ADMIN' ? 'ADMIN' : 'PERSONNE',
          conversationId,
          contenu: contenu.trim(),
          objet: contenu.trim().substring(0, 255),
          statut: 'Envoyé',
          dateEnvoi: new Date(),
          fichierUrl: fichierUrl || null,
          fichierNom: fichierNom || null,
        });

        const msgData = message.toJSON();
        msgData.isMine = true;

        const otherParticipants = await ConversationParticipant.findAll({
          where: { idConversation: conversationId, idUser: { [Op.ne]: userId } },
        });

        let otherNom = 'Utilisateur';
        for (const p of otherParticipants) {
          if (p.role === 'ADMIN') {
            const admin = await Admin.findByPk(p.idUser);
            if (admin) otherNom = admin.nom;
          } else {
            const pers = await Personne.findByPk(p.idUser);
            if (pers) otherNom = `${pers.prenom} ${pers.nom}`;
          }
          await notificationsService.create({
            idDestinataire: p.idUser,
            typeDestinataire: p.role || 'PERSONNE',
            titre: 'Nouveau message',
            message: `${username || 'Quelqu\'un'}: ${contenu.trim().substring(0, 100)}`,
            typeNotification: 'message',
            referenceType: 'Message',
            referenceId: message.idMessage,
          });
        }

        socket.to(`conv:${conversationId}`).emit('messages:new', { ...msgData, isMine: false, expediteur: otherNom });
        socket.to(`conv:${conversationId}`).emit('conversations:updated', { conversationId, lastMessage: contenu.trim().substring(0, 100), lastDate: message.dateEnvoi });

        for (const p of otherParticipants) {
          const targetRoom = `user:${p.idUser}`;
          io.to(targetRoom).emit('conversations:join-room', conversationId);
          io.to(targetRoom).emit('messages:new', { ...msgData, isMine: false, expediteur: otherNom });
          io.to(targetRoom).emit('conversations:updated', { conversationId, lastMessage: contenu.trim().substring(0, 100), lastDate: message.dateEnvoi });
        }

        callback?.({ success: true, message: { ...msgData, id: message.idMessage } });
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('messages:edit', async (data, callback) => {
      try {
        const { messageId, contenu } = data;
        if (!messageId || !contenu?.trim()) return callback?.({ error: 'Paramètres requis' });

        const message = await Message.findByPk(messageId);
        if (!message || message.expediteurId !== userId) return callback?.({ error: 'Modification non autorisée' });

        const now = new Date();
        const diff = now.getTime() - new Date(message.dateEnvoi).getTime();
        if (diff > 15 * 60 * 1000) return callback?.({ error: 'Délai de modification dépassé (15 min)' });

        await message.update({ contenu: contenu.trim(), editedAt: now });
        socket.to(`conv:${message.conversationId}`).emit('messages:edited', { idMessage: messageId, contenu: contenu.trim(), editedAt: now });

        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('messages:delete', async (data, callback) => {
      try {
        const { messageId } = data;
        if (!messageId) return callback?.({ error: 'messageId requis' });

        const message = await Message.findByPk(messageId);
        if (!message || message.expediteurId !== userId) return callback?.({ error: 'Suppression non autorisée' });

        await message.update({ deletedAt: new Date(), contenu: null });
        socket.to(`conv:${message.conversationId}`).emit('messages:deleted', { idMessage: messageId });

        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('messages:read', async (data) => {
      try {
        const { conversationId, messageIds } = data;
        if (!conversationId || !messageIds?.length) return;

        await Message.update(
          { statut: 'Lu', luLe: new Date() },
          { where: { idMessage: { [Op.in]: messageIds }, conversationId, destinataireId: userId } }
        );
        io.to(`conv:${conversationId}`).emit('messages:read-status', { messageIds, luLe: new Date() });

        await ConversationParticipant.update(
          { lastReadAt: new Date() },
          { where: { idConversation: conversationId, idUser: userId } }
        );
      } catch {}
    });

    socket.on('annonces:create', async (data, callback) => {
      try {
        const { titre, contenu, fichierUrl, fichierNom, fichierTaille } = data;
        if (!titre?.trim()) return callback?.({ error: 'Titre requis' });

        const { Annonce } = require('../models');
        const annonce = await Annonce.create({
          titre: titre.trim(),
          contenu: contenu?.trim() || null,
          auteurId: userId,
          auteurNom: username || 'Utilisateur',
          auteurRole: role,
          fichierUrl: fichierUrl || null,
          fichierNom: fichierNom || null,
          fichierTaille: fichierTaille || null,
          cibleRoles: 'ALL',
          dateCreation: new Date(),
        });

        io.emit('annonces:new', annonce.toJSON());

        const allUsers = await ConversationParticipant.findAll({
          attributes: ['idUser'],
          group: ['idUser'],
        });
        const uniqueUserIds = [...new Set(allUsers.map(p => p.idUser))];
        for (const uid of uniqueUserIds) {
          if (uid !== userId) {
            await notificationsService.create({
              idDestinataire: uid,
              typeDestinataire: 'PERSONNE',
              titre: 'Nouvelle annonce',
              message: `${username || 'Administration'}: ${titre}`,
              typeNotification: 'annonce',
              referenceType: 'Annonce',
              referenceId: annonce.idAnnonce,
            });
          }
        }

        callback?.({ success: true, annonce: annonce.toJSON() });
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('typing:start', (data) => {
      const { conversationId } = data;
      socket.to(`conv:${conversationId}`).emit('typing:update', { conversationId, userId, username, isTyping: true });
    });

    socket.on('typing:stop', (data) => {
      const { conversationId } = data;
      socket.to(`conv:${conversationId}`).emit('typing:update', { conversationId, userId, username, isTyping: false });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
}

module.exports = { setupSocket, onlineUsers };
