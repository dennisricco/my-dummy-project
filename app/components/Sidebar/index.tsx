'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MessageSquarePlus, Activity } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatList from './ChatList';
import AddFriendModal from './AddFriendModal';

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col h-full"
        style={{
          width: '320px',
          minWidth: '280px',
          maxWidth: '380px',
          flexShrink: 0,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRight: '1px solid transparent',
          borderLeft: '1px solid transparent',
          backgroundImage: 'var(--glass-bg)',
          backgroundClip: 'padding-box',
          position: 'relative',
        }}
      >
        {/* Gradient border overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(180deg, rgba(14,165,233,0.4) 0%, rgba(14,165,233,0.08) 40%, transparent 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Enhanced Header */}
        <div
          style={{
            padding: '24px 24px 20px',
            position: 'relative',
          }}
        >
          {/* Top Row: Avatar + Actions */}
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              style={{ flexShrink: 0 }}
            >
              <div
                className="rounded-full flex items-center justify-center font-bold"
                style={{
                  width: '48px',
                  height: '48px',
                  fontSize: '18px',
                  background: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                }}
              >
                R
              </div>
              <div
                className="absolute rounded-full border-2"
                style={{
                  bottom: '0',
                  right: '0',
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#10b981',
                  borderColor: 'var(--glass-bg)',
                }}
              />
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center" style={{ gap: '8px' }}>
              {/* New Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl transition-all duration-200"
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                title="New Chat"
              >
                <MessageSquarePlus style={{ width: '20px', height: '20px' }} />
              </motion.button>

              {/* Status Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl transition-all duration-200"
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                title="Status"
              >
                <Activity style={{ width: '20px', height: '20px' }} />
              </motion.button>

              {/* Add Friend Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddFriendModalOpen(true)}
                className="rounded-xl text-white font-semibold flex items-center transition-all duration-200"
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  gap: '8px',
                  background: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <UserPlus style={{ width: '16px', height: '16px' }} />
                <span>Add</span>
              </motion.button>
            </div>
          </div>

          {/* Title Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Messages
            </h1>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                letterSpacing: '0.05em',
              }}
            >
              NEW
            </span>
          </div>
          {/* Gradient accent underline */}
          <div
            style={{
              height: '2px',
              backgroundImage: 'linear-gradient(to right, var(--accent-primary), transparent)',
              borderRadius: '1px',
            }}
          />
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <ChatList searchQuery={searchQuery} />
      </div>

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
      />
    </>
  );
}
