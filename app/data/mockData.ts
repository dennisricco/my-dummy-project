import { Chat, Message } from '../types';

export const MOCK_CHATS: Chat[] = [
  {
    id: 'ai-bot',
    participant: {
      id: 'ai-bot',
      name: 'AI Assistant',
      avatar: '🤖',
      isOnline: true,
      isBot: true,
    },
    lastMessage: 'Hello! How can I help you today?',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 2),
    unreadCount: 1,
    isBot: true,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'ai-bot': [
    {
      id: 'msg-bot-1',
      chatId: 'ai-bot',
      sender: 'ai-bot',
      content: 'Hello! 👋 I am your AI assistant. Ask me anything and I\'ll do my best to help you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isBot: true,
      isUser: false,
    },
    {
      id: 'msg-bot-2',
      chatId: 'ai-bot',
      sender: 'me',
      content: 'Can you help me build a WhatsApp clone?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      isBot: false,
      isUser: true,
    },
    {
      id: 'msg-bot-3',
      chatId: 'ai-bot',
      sender: 'ai-bot',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isBot: true,
      isUser: false,
    },
  ],
  'chat-1': [
    {
      id: 'msg-1-1',
      chatId: 'chat-1',
      sender: 'user-1',
      content: 'Hey! How are you doing? 😊',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isBot: false,
      isUser: false,
    },
    {
      id: 'msg-1-2',
      chatId: 'chat-1',
      sender: 'me',
      content: 'I\'m great! Just working on some stuff. You?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isBot: false,
      isUser: true,
    },
    {
      id: 'msg-1-3',
      chatId: 'chat-1',
      sender: 'user-1',
      content: 'Same here! Can we meet at the usual spot?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isBot: false,
      isUser: false,
    },
  ],
};

export const BOT_REPLIES = [
  "That's a great question! Let me think about that... 🤔",
  "I'd be happy to help you with that! Here's what I know: the key is to break it down into smaller steps.",
  "Interesting! Based on my analysis, I think the best approach would be to start with the fundamentals.",
  "Great point! I can definitely assist you with that. What specific aspects would you like to explore?",
  "Absolutely! This is something I'm quite knowledgeable about. The answer involves several considerations...",
  "Of course! Let me provide you with a comprehensive response to your question. 💡",
  "I understand what you're asking. Here's a thoughtful perspective on the matter...",
  "That's fascinating! The topic you've raised is quite complex, but I can break it down for you. 🧠",
];
