import { create } from 'zustand';
import { Chat, Message, Theme, FriendSearchResult, FriendRequestStatus } from '../types';
import { MOCK_CHATS, MOCK_MESSAGES, BOT_REPLIES } from '../data/mockData';

interface ChatStore {
  theme: Theme;
  isAuthenticated: boolean;
  selectedChatId: string | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  isBotTyping: boolean;
  friendRequests: Map<string, FriendRequestStatus>;
  showAddFriendModal: boolean;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setIsAuthenticated: (v: boolean) => void;
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  sendFriendRequest: (userId: string) => void;
  searchUsers: (query: string) => Promise<FriendSearchResult[]>;
  setShowAddFriendModal: (show: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  theme: 'light',
  isAuthenticated: false,
  selectedChatId: null,
  chats: MOCK_CHATS,
  messages: MOCK_MESSAGES,
  isBotTyping: false,
  friendRequests: new Map(),
  showAddFriendModal: false,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  setShowAddFriendModal: (show) => set({ showAddFriendModal: show }),

  selectChat: (chatId) => {
    set((state) => ({
      selectedChatId: chatId,
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  sendMessage: (chatId, content) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'me',
      content,
      timestamp: new Date(),
      isBot: false,
      isUser: true,
    };

    set((state) => {
      const existing = state.messages[chatId] ?? [];
      return {
        messages: { ...state.messages, [chatId]: [...existing, newMsg] },
        chats: state.chats.map((c) =>
          c.id === chatId
            ? { ...c, lastMessage: content, lastTimestamp: new Date() }
            : c
        ),
      };
    });

    // If this is the AI bot chat, simulate a bot reply
    const chat = get().chats.find((c) => c.id === chatId);
    if (chat?.isBot) {
      set({ isBotTyping: true });
      const delay = 1500 + Math.random() * 1000;
      setTimeout(() => {
        const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
        const botMsg: Message = {
          id: `msg-bot-${Date.now()}`,
          chatId,
          sender: 'ai-bot',
          content: reply,
          timestamp: new Date(),
          isBot: true,
          isUser: false,
        };
        set((state) => ({
          isBotTyping: false,
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] ?? []), botMsg],
          },
          chats: state.chats.map((c) =>
            c.id === chatId
              ? { ...c, lastMessage: reply, lastTimestamp: new Date() }
              : c
          ),
        }));
      }, delay);
    }
  },

  sendFriendRequest: (userId) => {
    set((state) => {
      const newRequests = new Map(state.friendRequests);
      newRequests.set(userId, 'pending');
      return { friendRequests: newRequests };
    });
  },

  searchUsers: async (query: string): Promise<FriendSearchResult[]> => {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const mockUsers: FriendSearchResult[] = [
      { id: 'u1', name: 'Sarah Chen', avatar: '👩‍💻', email: 'sarah.chen@example.com', isOnline: true, statusMessage: 'Building something cool', friendStatus: 'none' },
      { id: 'u2', name: 'Mike Johnson', avatar: '🧑‍💼', email: 'mike.j@example.com', isOnline: false, statusMessage: 'Away on vacation', friendStatus: 'none' },
      { id: 'u3', name: 'Emma Wilson', avatar: '👩‍🎨', email: 'emma.w@example.com', isOnline: true, statusMessage: 'Designing the future', friendStatus: 'none' },
      { id: 'u4', name: 'Alex Rodriguez', avatar: '🧑‍🔬', email: 'alex.r@example.com', isOnline: true, statusMessage: 'In a meeting', friendStatus: 'none' },
      { id: 'u5', name: 'Lisa Park', avatar: '👩‍🚀', email: 'lisa.park@example.com', isOnline: false, statusMessage: 'Exploring new ideas', friendStatus: 'none' },
    ];

    const { friendRequests } = get();
    const filtered = mockUsers
      .filter((u) => 
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase())
      )
      .map((u) => ({
        ...u,
        friendStatus: friendRequests.get(u.id) || 'none',
      }));

    return filtered;
  },
}));
