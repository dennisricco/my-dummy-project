'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, MessageSquare, Bot, Sun, Moon, Search, User } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export default function NavBar() {
  const theme = useChatStore((s) => s.theme);
  const toggleTheme = useChatStore((s) => s.toggleTheme);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: MessageSquare, label: 'Chats', active: true },
    { icon: Bot, label: 'AI Assistant' },
    { icon: Search, label: 'Search' },
  ];

  return (
    <div
      className="flex flex-col items-center pb-10 glass-panel h-full border-r"
      style={{
        width: '88px',
        minWidth: '88px',
        borderColor: 'var(--border-color)',
        zIndex: 20,
        paddingTop: '48px',
      }}
    >
      {/* Brand logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 180 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="w-14 h-14 rounded-[16px] flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          boxShadow: '0 4px 15px var(--accent-glow)',
          marginBottom: '48px',
        }}
      >
        <Bot size={28} color="white" />
      </motion.div>

      {/* Nav links */}
      <div className="flex flex-col gap-8 flex-1 w-full items-center">
        {navItems.map((item) => (
          <div key={item.label} className="relative flex items-center">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 rounded-2xl transition-colors duration-300"
              style={{
                color: item.active ? 'var(--accent-primary)' : 'var(--text-muted)',
                backgroundColor: item.active ? 'var(--bg-hover)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <item.icon size={26} strokeWidth={item.active ? 2.5 : 1.5} />
              {item.active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md"
                  style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-glow)' }}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {hoveredItem === item.label && (
                <motion.div
                  role="tooltip"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 50,
                  }}
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-8 items-center mt-auto">
        <div className="relative flex items-center">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-3 rounded-2xl transition-colors duration-300"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={() => setHoveredItem('Toggle Theme')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {theme === 'dark' ? (
              <Sun size={26} strokeWidth={1.5} data-testid="icon-sun" />
            ) : (
              <Moon size={26} strokeWidth={1.5} data-testid="icon-moon" />
            )}
          </motion.button>

          <AnimatePresence>
            {hoveredItem === 'Toggle Theme' && (
              <motion.div
                role="tooltip"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  zIndex: 50,
                }}
              >
                Toggle Theme
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-white/10"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <User size={22} color="var(--text-muted)" />
        </motion.div>
      </div>
    </div>
  );
}
