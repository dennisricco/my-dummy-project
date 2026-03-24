'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        padding: '12px 20px 20px',
        backgroundColor: 'transparent',
      }}
    >
      <div className="relative flex items-center">
        {/* Animated focus ring */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: focused
              ? '0 0 0 2px var(--accent-primary), 0 0 16px var(--accent-glow)'
              : '0 0 0 1px var(--border-color)',
          }}
          transition={{ duration: 0.2 }}
          style={{ borderRadius: '999px' }}
        />

        {/* Search Icon */}
        <div
          className="absolute left-4 flex items-center justify-center pointer-events-none z-10"
          style={{
            color: focused ? 'var(--accent-primary)' : 'var(--text-muted)',
            transition: 'color 200ms ease',
          }}
        >
          <Search size={17} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search..."
          className="w-full outline-none text-sm"
          style={{
            paddingLeft: '44px',
            paddingRight: value ? '44px' : '20px',
            paddingTop: '11px',
            paddingBottom: '11px',
            borderRadius: '999px',
            backgroundColor: 'var(--bg-hover)',
            border: 'none',
            color: 'var(--text-primary)',
            transition: 'background-color 300ms ease, color 300ms ease',
          }}
        />

        {/* Clear button */}
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-3 z-10 p-1.5 rounded-full transition-colors"
            style={{
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <X size={14} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
