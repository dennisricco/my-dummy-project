'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import { FriendSearchResult } from '../../types';
import { UserPlus, Search, X, Loader2 } from 'lucide-react';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchUsers = useChatStore((s) => s.searchUsers);
  const sendFriendRequest = useChatStore((s) => s.sendFriendRequest);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const handleAddFriend = (userId: string) => {
    sendFriendRequest(userId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
              width: '90%',
              maxWidth: '520px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 1px rgba(14, 165, 233, 0.2)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '24px 28px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-header)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                      }}
                    >
                      <UserPlus style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <h2
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Add Friend
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      color: 'var(--text-muted)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <X style={{ width: '20px', height: '20px' }} />
                  </motion.button>
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ padding: '20px 28px' }}>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.borderColor = 'var(--accent-primary)';
                    target.style.backgroundColor = 'var(--bg-primary)';
                    target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                  }}
                  onBlur={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.borderColor = 'transparent';
                    target.style.backgroundColor = 'var(--bg-secondary)';
                    target.style.boxShadow = 'none';
                  }}
                >
                  <Search style={{ width: '20px', height: '20px', color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      outline: 'none',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      border: 'none',
                    }}
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} className="animate-spin" />
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div style={{ padding: '0 28px 28px', maxHeight: '400px', overflowY: 'auto' }}>
                {searchQuery.trim() === '' ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      <Search style={{ width: '32px', height: '32px', color: 'var(--text-muted)' }} />
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      Start typing to search for friends
                    </p>
                  </div>
                ) : searchResults.length === 0 && !isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '48px 20px' }}
                  >
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      No users found matching "{searchQuery}"
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <AnimatePresence mode="popLayout">
                      {searchResults.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.04 }}
                          style={{
                            padding: '16px',
                            borderRadius: '14px',
                            backgroundColor: 'var(--bg-secondary)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '20px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                              >
                                {user.avatar}
                              </div>
                              {user.isOnline && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--bg-secondary)',
                                    backgroundColor: '#10b981',
                                  }}
                                />
                              )}
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  color: 'var(--text-primary)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  marginBottom: '2px',
                                }}
                              >
                                {user.name}
                              </p>
                              <p
                                style={{
                                  fontSize: '12px',
                                  color: 'var(--text-muted)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {user.statusMessage || user.email}
                              </p>
                            </div>

                            {/* Add Friend Button */}
                            <AddFriendButton
                              status={user.friendStatus}
                              onClick={() => handleAddFriend(user.id)}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface AddFriendButtonProps {
  status: 'none' | 'pending' | 'accepted';
  onClick: () => void;
}

function AddFriendButton({ status, onClick }: AddFriendButtonProps) {
  const buttonConfig = {
    none: {
      text: 'Add',
      icon: <UserPlus style={{ width: '16px', height: '16px' }} />,
      bg: 'linear-gradient(135deg, var(--accent-primary), #0ea5e9)',
      hoverBg: 'linear-gradient(135deg, #0284c7, #0369a1)',
      color: 'white',
    },
    pending: {
      text: 'Pending',
      icon: <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />,
      bg: 'var(--bg-tertiary)',
      hoverBg: 'var(--bg-tertiary)',
      color: 'var(--text-muted)',
    },
    accepted: {
      text: 'Friends',
      icon: <span style={{ fontSize: '14px' }}>✓</span>,
      bg: '#10b981',
      hoverBg: '#059669',
      color: 'white',
    },
  };

  const config = buttonConfig[status];

  return (
    <motion.button
      layout
      onClick={status === 'none' ? onClick : undefined}
      disabled={status !== 'none'}
      style={{
        padding: '8px 16px',
        borderRadius: '10px',
        color: config.color,
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: config.bg,
        cursor: status === 'none' ? 'pointer' : 'default',
        opacity: status === 'pending' ? 0.7 : 1,
        transition: 'all 0.2s',
        border: 'none',
        flexShrink: 0,
      }}
      whileHover={status === 'none' ? { scale: 1.05 } : {}}
      whileTap={status === 'none' ? { scale: 0.95 } : {}}
      onMouseEnter={(e) => {
        if (status === 'none') {
          e.currentTarget.style.background = config.hoverBg;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = config.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {config.icon}
      <span>{config.text}</span>
    </motion.button>
  );
}
