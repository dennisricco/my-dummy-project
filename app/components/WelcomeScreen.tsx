'use client';

import { motion } from 'framer-motion';
import { Bot, Shield, Zap, Lock } from 'lucide-react';

export default function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center flex-1 h-full gap-8 select-none bg-transparent"
    >
      {/* 3D Glowing Icon */}
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
          rotateX: [0, 10, -10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 rounded-[2rem] flex items-center justify-center relative backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.4))',
          boxShadow: '0 0 40px var(--accent-glow)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Bot size={56} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        
        {/* Orbit ring */}
        <motion.div
          data-testid="orbit-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-4xl border border-dashed border-sky-400/30 scale-125"
          style={{ opacity: 0.15 }}
        />
      </motion.div>

      {/* Headline */}
      <div className="text-center max-w-sm">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to right, white, var(--text-muted))' }}
        >
          Nexus Command
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          Initialize communication link from the secure panel. Connect with the{' '}
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Quantum AI</span>{' '}
          for advanced operations.
        </motion.p>
      </div>

      {/* Features row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex items-center gap-8 mt-4"
        style={{ color: 'var(--text-muted)' }}
      >
        {[
          { icon: Lock, label: 'Encrypted' },
          { icon: Zap, label: 'Zero Latency' },
          { icon: Shield, label: 'Secured' },
        ].map((f, i) => (
          <motion.div 
            key={f.label} 
            whileHover={{ y: -5, color: 'var(--accent-primary)' }}
            className="flex flex-col items-center gap-2 text-center transition-colors"
          >
            <f.icon size={24} />
            <span className="text-[10px] font-bold tracking-widest uppercase">{f.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2 text-[10px] font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        SYSTEM_ONLINE • v4.0.0
      </motion.div>
    </motion.div>
  );
}
