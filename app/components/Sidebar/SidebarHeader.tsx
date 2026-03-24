'use client';

import { useChatStore } from '../../store/useChatStore';
import { MessageSquarePlus, Activity, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SidebarHeader() {
  const theme = useChatStore((s) => s.theme);
  const toggleThemeFn = useChatStore((s) => s.toggleTheme);
  const setShowAddFriendModal = useChatStore((s) => s.setShowAddFriendModal);

  return (
    <div
      className="flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 300ms ease, border-color 300ms ease',
        padding: '20px 24px',
        minHeight: '80px',
      }}
    >
      {/* Left: Avatar with online status */}
      <div className="relative cursor-pointer" tabIndex={0}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
          }}
          title="My Profile"
        >
          R
        </div>
        <div
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
          style={{
            backgroundColor: '#10b981',
            borderColor: 'var(--glass-bg)',
          }}
        />
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl transition-all duration-200"
          title="New Chat"
          tabIndex={0}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <MessageSquarePlus className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl transition-all duration-200"
          title="Status"
          tabIndex={0}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <Activity className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddFriendModal(true)}
          className="px-3 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all duration-200"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
          }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add</span>
        </motion.button>
      </div>
    </div>
  );
}
