'use client';

import { motion } from 'framer-motion';
import { Chat } from '../../types';
import { formatTime } from '../../utils/formatTime';

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export default function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer relative rounded-2xl"
      style={{
        padding: '10px 12px',
        backgroundColor: isSelected ? 'var(--bg-selected)' : 'transparent',
        border: isSelected
          ? '1px solid rgba(14, 165, 233, 0.35)'
          : '1px solid transparent',
        boxShadow: isSelected ? '0 2px 16px var(--accent-glow)' : 'none',
        transition: 'background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
        }
      }}
    >
      {/* Selected indicator bar */}
      {isSelected && (
        <motion.div
          layoutId="chat-selected-bar"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            margin: 'auto 0',
            width: '3px',
            height: '55%',
            borderRadius: '0 3px 3px 0',
            backgroundColor: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-glow)',
          }}
        />
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center select-none ${
            chat.isBot ? 'bot-avatar-glow' : ''
          }`}
          style={{
            background: chat.isBot
              ? 'linear-gradient(135deg, #091221, #10213d)'
              : 'var(--bg-hover)',
            border: chat.isBot
              ? '1.5px solid var(--accent-primary)'
              : '1.5px solid var(--border-color)',
            fontSize: '1.35rem',
            boxShadow: chat.isBot ? '0 4px 12px var(--accent-glow)' : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {chat.participant.avatar}
        </div>
        {/* Online dot */}
        {chat.participant.isOnline && (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
            style={{
              backgroundColor: '#22c55e',
              border: '2px solid var(--bg-sidebar)',
              boxShadow: '0 0 6px rgba(34,197,94,0.6)',
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
          <span
            className="text-sm truncate"
            style={{
              color: 'var(--text-primary)',
              fontWeight: chat.unreadCount > 0 ? 700 : 500,
            }}
          >
            {chat.participant.name}
          </span>
          <span
            className="shrink-0"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              marginLeft: '8px',
              color: chat.unreadCount > 0 ? 'var(--accent-primary)' : 'var(--text-muted)',
            }}
          >
            {formatTime(chat.lastTimestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p
            className="text-xs truncate"
            style={{
              color: chat.unreadCount > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
              fontWeight: chat.unreadCount > 0 ? 500 : 400,
              maxWidth: '160px',
            }}
          >
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="shrink-0 flex items-center justify-center"
              style={{
                marginLeft: '8px',
                minWidth: '20px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                padding: '0 6px',
                boxShadow: '0 2px 8px var(--accent-glow)',
              }}
            >
              {chat.unreadCount}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
