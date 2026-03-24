'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex justify-start pointer-events-none"
      style={{ marginTop: '20px', paddingLeft: '28px', paddingRight: '28px' }}
    >
      <div
        className="flex items-center gap-1.5"
        style={{
          padding: '10px 16px',
          borderRadius: '18px 18px 18px 4px',
          backgroundColor: 'var(--bg-message-in)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-4 right-4 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.25), transparent)',
          }}
        />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot"
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: 'var(--accent-primary)',
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
