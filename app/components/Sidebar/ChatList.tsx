'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import ChatItem from './ChatItem';

interface ChatListProps {
  searchQuery: string;
}

export default function ChatList({ searchQuery }: ChatListProps) {
  const chats = useChatStore((s) => s.chats);
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const selectChat = useChatStore((s) => s.selectChat);

  const filtered = chats.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-sidebar)', padding: '0 10px 16px' }}
    >
      {filtered.length === 0 ? (
        <motion.div
          data-testid="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-40 gap-3 px-4"
        >
          <svg
            style={{ width: '40px', height: '40px', opacity: 0.35, color: 'var(--text-muted)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <p className="text-sm text-center" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            No results for{' '}
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              &ldquo;{searchQuery}&rdquo;
            </span>
          </p>
        </motion.div>
      ) : (
        <>
          {/* Section label */}
          {!searchQuery && (
            <div
              style={{
                padding: '8px 4px 6px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Recent
            </div>
          )}

          <AnimatePresence initial={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {filtered.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isSelected={chat.id === selectedChatId}
                  onClick={() => selectChat(chat.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
