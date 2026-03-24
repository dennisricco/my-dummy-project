'use client';

import { useChatStore } from '../../store/useChatStore';
import { Search, MoreVertical, Phone, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatHeader() {
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const chats = useChatStore((s) => s.chats);
  const isBotTyping = useChatStore((s) => s.isBotTyping);

  const chat = chats.find((c) => c.id === selectedChatId);
  if (!chat) return null;

  const isBot = chat.isBot;
  const isTyping = isBot && isBotTyping;

  const actionButtons = [
    { icon: Video, label: 'Video call' },
    { icon: Phone, label: 'Voice call' },
    { icon: Search, label: 'Search' },
    { icon: MoreVertical, label: 'More' },
  ];

  return (
    <div
      className="flex items-center backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-header)',
        minHeight: '80px',
        padding: '16px 28px',
        gap: '16px',
        zIndex: 10,
        position: 'relative',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl select-none ${
            isBot ? 'bot-avatar-glow' : ''
          }`}
          style={{
            background: isBot ? 'linear-gradient(135deg, #091221, #10213d)' : 'var(--bg-hover)',
            border: isBot ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-color)',
            boxShadow: isBot ? '0 4px 12px var(--accent-glow)' : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {chat.participant.avatar}
        </div>
        {chat.participant.isOnline && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
            style={{
              backgroundColor: '#22c55e',
              border: '2px solid var(--bg-primary)',
              boxShadow: '0 0 6px rgba(34,197,94,0.7)',
            }}
          />
        )}
      </div>

      {/* Name & Status */}
      <div className="flex-1 min-w-0">
        <p
          className="text-base font-bold truncate"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {chat.participant.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {isTyping ? (
            <>
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                typing
              </span>
              <span className="typing-dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-primary)' }} />
              <span className="typing-dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-primary)' }} />
              <span className="typing-dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-primary)' }} />
            </>
          ) : chat.participant.isOnline ? (
            <>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 4px rgba(34,197,94,0.8)',
                }}
              />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Online
              </span>
            </>
          ) : (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center" style={{ gap: '15px', marginLeft: '8px' }}>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', marginRight: '6px' }} />
        {actionButtons.map(({ icon: Icon, label }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-hover)' }}
            whileTap={{ scale: 0.92 }}
            title={label}
            className="p-3 rounded-xl transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Icon size={20} strokeWidth={1.8} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
