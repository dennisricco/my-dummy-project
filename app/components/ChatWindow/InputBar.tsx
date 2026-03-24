'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';

export default function InputBar() {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (!hasText || !selectedChatId) return;
    sendMessage(selectedChatId, text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex items-center gap-3 backdrop-blur-md"
      style={{
        padding: '14px 20px',
        backgroundColor: 'var(--bg-header)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {/* Utility buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {[
          { icon: Smile, label: 'Emoji' },
          { icon: Paperclip, label: 'Attach' },
        ].map(({ icon: Icon, label }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            title={label}
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Icon size={20} strokeWidth={1.8} />
          </motion.button>
        ))}
      </div>

      {/* Input field */}
      <div className="flex-1 relative">
        {/* Focus glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: focused
              ? '0 0 0 2px var(--accent-primary), 0 0 16px var(--accent-glow)'
              : '0 0 0 1px rgba(255,255,255,0.08)',
          }}
          transition={{ duration: 0.2 }}
          style={{ borderRadius: '999px' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type a message..."
          className="relative w-full outline-none text-sm"
          style={{
            padding: '12px 20px',
            borderRadius: '999px',
            backgroundColor: 'var(--bg-hover)',
            border: 'none',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Send / Mic */}
      <div className="w-11 h-11 shrink-0 relative">
        <AnimatePresence mode="wait">
          {hasText ? (
            <motion.button
              key="send"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSend}
              title="Send"
              className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                boxShadow: '0 4px 14px var(--accent-glow)',
              }}
            >
              <Send size={18} className="ml-0.5" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Voice"
              className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Mic size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
