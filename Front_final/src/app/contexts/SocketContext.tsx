import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: any;
  onlineUsers: number[];
  connected: boolean;
  typingUsers: Record<number, { conversationId: number; username: string; isTyping: boolean }[]>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
  connected: false,
  typingUsers: {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const socketRef = useRef<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<number, { conversationId: number; username: string; isTyping: boolean }[]>>({});

  useEffect(() => {
    if (!token || !user) return;

    const initSocket = async () => {
      const { io } = await import('socket.io-client');
      if (socketRef.current?.connected) return;

      const s = io('http://localhost:8080', {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      s.on('connect', () => {
        setConnected(true);
      });

      s.on('disconnect', () => {
        setConnected(false);
      });

      s.on('users:online', (ids: number[]) => {
        setOnlineUsers(ids);
      });

      s.on('conversations:join-room', (convId: number) => {
        s.emit('conversations:join', [convId]);
      });

      s.on('typing:update', (data: { conversationId: number; userId: number; username: string; isTyping: boolean }) => {
        setTypingUsers(prev => {
          const convId = data.conversationId;
          const existing = prev[convId] || [];
          const filtered = existing.filter(t => t.username !== data.username);
          if (data.isTyping) {
            return { ...prev, [convId]: [...filtered, { conversationId: convId, username: data.username, isTyping: true }] };
          }
          return { ...prev, [convId]: filtered };
        });
      });

      socketRef.current = s;
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, connected, typingUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
