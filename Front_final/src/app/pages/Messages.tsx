import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { conversationsAPI } from '../services/api';
import ConversationList from '../components/chat/ConversationList';
import UserList from '../components/chat/UserList';
import ChatArea from '../components/chat/ChatArea';
import NewConversationModal from '../components/chat/NewConversationModal';
import CreateAnnonceModal from '../components/chat/CreateAnnonceModal';

export default function Messages() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedOtherUsers, setSelectedOtherUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAnnonceModal, setShowAnnonceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileConvOpen, setMobileConvOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const canAnnonce = user?.role !== 'PARENT' && user?.role !== 'ENSEIGNANT';

  const refreshConversations = useCallback(() => {
    if (!user?.idPers) return;
    setLoading(true);
    conversationsAPI.list()
      .then(data => {
        const list = data?.data || data;
        setConversations(Array.isArray(list) ? list : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.idPers]);

  useEffect(() => { refreshConversations(); }, [refreshConversations]);

  const selectedConv = conversations.find(c => c.id === selectedId);
  const hasConversations = conversations.length > 0;

  const handleSelect = (convId: number) => {
    setSelectedId(convId);
    setSelectedOtherUsers(conversations.find(c => c.id === convId)?.otherUsers || []);
    setMobileConvOpen(true);
  };

  const handleBack = () => setMobileConvOpen(false);

  const handleCreated = (convId: number, otherUser?: { id: number; nom: string; role: string }) => {
    setSelectedId(convId);
    setSelectedOtherUsers(otherUser ? [otherUser] : []);
    setMobileConvOpen(true);
    setShowUserList(false);
    refreshConversations();
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-xl overflow-hidden border border-border/50 bg-card">
      <div className={`${mobileConvOpen ? 'hidden md:flex' : 'flex'} flex-shrink-0`}>
        {showUserList || (!hasConversations && !loading) ? (
          <UserList
            currentUserId={user?.idPers || 0}
            currentUserRole={user?.role}
            onSelect={handleCreated}
            onBack={() => setShowUserList(false)}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNewChat={() => setShowModal(true)}
            onShowAllUsers={() => setShowUserList(true)}
            currentUserId={user?.idPers || 0}
            loading={loading}
          />
        )}
      </div>

      <div className={`flex-1 flex ${!mobileConvOpen ? 'hidden md:flex' : 'flex'}`}>
        <ChatArea
          conversationId={selectedId}
          otherUsers={selectedOtherUsers}
          onBack={handleBack}
        />
      </div>

      <NewConversationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
        onNewAnnonce={canAnnonce ? () => setShowAnnonceModal(true) : undefined}
        currentUserId={user?.idPers || 0}
        currentUserRole={user?.role}
      />
      {canAnnonce && <CreateAnnonceModal
        open={showAnnonceModal}
        onClose={() => setShowAnnonceModal(false)}
        onCreated={refreshConversations}
      />}
    </div>
  );
}
