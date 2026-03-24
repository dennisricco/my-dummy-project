'use client';

import { motion, Variants } from 'framer-motion';
import {
  Activity, Zap, Shield, Cpu, Clock, Server,
  MessageSquarePlus, Download, Settings, User, Wifi, WifiOff,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const STAT_ROWS = [
  { icon: Activity, color: '#22c55e',  label: 'Status',        value: 'Online',     testId: 'stat-status' },
  { icon: Zap,      color: '#eab308',  label: 'Latency',       value: '14ms',       testId: 'stat-latency' },
  { icon: Shield,   color: '#0ea5e9',  label: 'Security',      value: 'Encrypted',  testId: 'stat-security' },
  { icon: Cpu,      color: '#a855f7',  label: 'Model',         value: 'v4-Turbo',   testId: 'stat-model' },
  { icon: Clock,    color: '#f97316',  label: 'Response Time', value: '~1.2s',      testId: 'stat-response-time' },
  { icon: Server,   color: '#06b6d4',  label: 'Uptime',        value: '99.9%',      testId: 'stat-uptime' },
];

const QUICK_ACTIONS = [
  { icon: MessageSquarePlus, label: 'New Chat',  testId: 'action-new-chat' },
  { icon: Download,          label: 'Export',    testId: 'action-export' },
  { icon: Settings,          label: 'Settings',  testId: 'action-settings' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function AIProfile() {
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const chats          = useChatStore((s) => s.chats);
  const chat           = chats.find((c) => c.id === selectedChatId);
  const isBot          = chat?.isBot ?? false;
  const isOnline       = chat?.participant.isOnline ?? false;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ width: '300px', minWidth: '300px' }}
    >
      {/* ── Header strip ── */}
      <div
        className="flex items-center gap-2 border-b"
        style={{ padding: '16px 32px', borderColor: 'var(--border-color)' }}
      >
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Profile
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-8" style={{ padding: '32px' }}>

        {/* ── Avatar + name ── */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Avatar ring */}
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${isBot ? 'bot-avatar-glow' : ''}`}
              style={{
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-hover))',
                border: '2px solid var(--accent-primary)',
              }}
            >
              {selectedChatId
                ? (isBot ? '🤖' : chat?.participant.avatar)
                : <User size={32} color="var(--text-muted)" />}
            </div>

            {/* Online dot */}
            {selectedChatId && (
              <span
                className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: isOnline ? '#22c55e' : 'var(--text-muted)',
                  borderColor: 'var(--bg-secondary)',
                }}
              />
            )}
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {selectedChatId
                ? (isBot ? 'Nexus Core AI' : chat?.participant.name)
                : 'No Chat Selected'}
            </h2>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              {selectedChatId
                ? (isBot ? 'AI · v4-Turbo' : isOnline ? 'Online' : 'Offline')
                : 'Select a conversation'}
            </p>
          </div>

          {/* Status badge */}
          {selectedChatId && (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
              style={{
                backgroundColor: 'rgba(14,165,233,0.08)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
              }}
            >
              {isOnline
                ? <><Wifi size={10} /> Active</>
                : <><WifiOff size={10} /> Away</>}
            </div>
          )}
        </motion.div>

        {/* ── Empty state ── */}
        {!selectedChatId && (
          <div data-testid="placeholder-state" className="flex flex-col gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl animate-pulse"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', animationDelay: `${i * 80}ms` }}
              />
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'rgba(255,255,255,0.025)', animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Bot stats ── */}
        {isBot && (
          <motion.div
            className="flex flex-col gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats section */}
            <div data-testid="bot-stats" className="flex flex-col gap-2.5">
              <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                System Stats
              </p>
              {STAT_ROWS.map((row) => (
                <motion.div
                  key={row.label}
                  data-testid={row.testId}
                  variants={itemVariants}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${row.color}18` }}
                    >
                      <row.icon size={14} color={row.color} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {row.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold tabular-nums" style={{ color: row.color }}>
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Quick actions */}
            <div data-testid="quick-actions" className="flex flex-col gap-2.5">
              <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                Quick Actions
              </p>
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.label}
                  data-testid={action.testId}
                  variants={itemVariants}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(14,165,233,0.12)' }}
                  >
                    <action.icon size={14} color="var(--accent-primary)" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── User profile ── */}
        {selectedChatId && !isBot && (
          <motion.div
            data-testid="user-profile"
            className="flex flex-col gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase px-1" style={{ color: 'var(--text-muted)' }}>
              Info
            </p>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: isOnline ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)' }}
                >
                  <Activity size={14} color={isOnline ? '#22c55e' : 'var(--text-muted)'} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Status</span>
              </div>
              <span className="text-xs font-bold" style={{ color: isOnline ? '#22c55e' : 'var(--text-muted)' }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
