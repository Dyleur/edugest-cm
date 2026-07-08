const { Op } = require('sequelize');
const { Conversation, ConversationParticipant, Message, Personne, Admin } = require('../models');

const getOrCreateDirect = async (userId, otherUserId, userRole) => {
  let conv = await Conversation.findOne({
    where: { type: 'direct' },
    include: [{
      model: ConversationParticipant,
      where: { idUser: userId },
    }],
  });

  const existing = await Conversation.findAll({
    where: { type: 'direct' },
    include: [{
      model: ConversationParticipant,
      where: { idUser: { [Op.in]: [userId, otherUserId] } },
    }],
  });

  for (const c of existing) {
    const parts = await ConversationParticipant.findAll({ where: { idConversation: c.idConversation } });
    const ids = parts.map(p => p.idUser);
    if (ids.includes(userId) && ids.includes(otherUserId)) {
      return c;
    }
  }

  const conversation = await Conversation.create({ type: 'direct' });
  await ConversationParticipant.bulkCreate([
    { idConversation: conversation.idConversation, idUser: userId, role: userRole },
    { idConversation: conversation.idConversation, idUser: otherUserId, role: null },
  ]);
  return conversation;
};

const getUserConversations = async (userId) => {
  const participants = await ConversationParticipant.findAll({
    where: { idUser: userId },
    attributes: ['idConversation', 'lastReadAt'],
  });

  const convIds = participants.map(p => p.idConversation);
  if (convIds.length === 0) return [];

  const convs = await Conversation.findAll({
    where: { idConversation: { [Op.in]: convIds } },
    order: [['updated_at', 'DESC']],
  });

  const results = [];
  for (const conv of convs) {
    const lastMsg = await Message.findOne({
      where: { conversationId: conv.idConversation, deletedAt: null },
      order: [['dateEnvoi', 'DESC']],
    });

    const partis = await ConversationParticipant.findAll({
      where: { idConversation: conv.idConversation, idUser: { [Op.ne]: userId } },
    });

    const otherUsers = [];
    for (const p of partis) {
      let nom = 'Inconnu';
      let role = '';
      if (p.role === 'ADMIN') {
        const admin = await Admin.findByPk(p.idUser);
        if (admin) { nom = admin.nom; role = 'Admin'; }
      } else {
        const pers = await Personne.findByPk(p.idUser);
        if (pers) {
          nom = `${pers.prenom} ${pers.nom}`;
          const roleMap = { 1: 'ENSEIGNANT', 2: 'DIRECTEUR', 3: 'RESPONSABLE_ADMIN', 4: 'PARENT' };
          role = roleMap[pers.typePersonne] || 'PERSONNE';
        }
      }
      otherUsers.push({ id: p.idUser, nom, role });
    }

    const myPart = participants.find(p => p.idConversation === conv.idConversation);
    const unreadCount = lastMsg && myPart
      ? await Message.count({
          where: {
            conversationId: conv.idConversation,
            expediteurId: { [Op.ne]: userId },
            deletedAt: null,
            dateEnvoi: { [Op.gt]: myPart.lastReadAt || new Date(0) },
          },
        })
      : 0;

    results.push({
      id: conv.idConversation,
      otherUsers,
      lastMessage: lastMsg ? { contenu: lastMsg.contenu, date: lastMsg.dateEnvoi, expediteurId: lastMsg.expediteurId } : null,
      unreadCount,
      updatedAt: conv.updated_at,
    });
  }
  return results;
};

const getConversationMessages = async (conversationId, userId, page = 1, limit = 50) => {
  const participant = await ConversationParticipant.findOne({
    where: { idConversation: conversationId, idUser: userId },
  });
  if (!participant) throw new Error('Accès refusé');

  const offset = (page - 1) * limit;
  const messages = await Message.findAll({
    where: { conversationId, deletedAt: null },
    order: [['dateEnvoi', 'DESC']],
    limit,
    offset,
  });

  const total = await Message.count({ where: { conversationId, deletedAt: null } });

  const enriched = [];
  for (const msg of messages.reverse()) {
    let expediteur = '';
    if (msg.expediteurType === 'ADMIN') {
      const admin = await Admin.findByPk(msg.expediteurId);
      expediteur = admin ? admin.nom : 'Admin';
    } else {
      const pers = await Personne.findByPk(msg.expediteurId);
      expediteur = pers ? `${pers.prenom} ${pers.nom}` : 'Inconnu';
    }
    enriched.push({
      ...msg.toJSON(),
      expediteur,
      isMine: msg.expediteurId === userId,
    });
  }

  return { messages: enriched, total, page, totalPages: Math.ceil(total / limit) };
};

const createConversation = async (userId, participantIds, userRole) => {
  const conversation = await Conversation.create({ type: 'direct' });
  const participants = [
    { idConversation: conversation.idConversation, idUser: userId, role: userRole },
    ...participantIds.map(id => ({ idConversation: conversation.idConversation, idUser: id, role: null })),
  ];
  await ConversationParticipant.bulkCreate(participants);
  return conversation;
};

module.exports = { getOrCreateDirect, getUserConversations, getConversationMessages, createConversation };
