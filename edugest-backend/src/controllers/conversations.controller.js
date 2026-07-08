const conversationsService = require('../services/conversations.service');

const list = async (req, res) => {
  try {
    const convs = await conversationsService.getUserConversations(req.user.idPers);
    res.json({ success: true, data: convs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const result = await conversationsService.getConversationMessages(parseInt(id), req.user.idPers, page);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(error.message === 'Accès refusé' ? 403 : 500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { participantIds } = req.body;
    if (!participantIds?.length) return res.status(400).json({ success: false, message: 'participantIds requis' });
    const conv = await conversationsService.createConversation(req.user.idPers, participantIds, req.user.role);
    res.status(201).json({ success: true, data: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrCreate = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    if (!otherUserId) return res.status(400).json({ success: false, message: 'otherUserId requis' });
    const conv = await conversationsService.getOrCreateDirect(req.user.idPers, otherUserId, req.user.role);
    res.json({ success: true, data: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { list, getMessages, create, getOrCreate };
