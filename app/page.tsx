'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatStore } from './store/useChatStore';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import WelcomeScreen from './components/WelcomeScreen';
import AIProfile from './components/AIProfile';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useChatStore((s) => s.isAuthenticated);
  const selectedChatId = useChatStore((s) => s.selectedChatId);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main
      className="flex h-screen w-screen overflow-hidden bg-chat-pattern"
      style={{ transition: 'background-color 300ms ease' }}
    >
      {/* Bento Box Layout Wrapper */}
      <div className="flex w-full h-full p-4 gap-4" style={{ zIndex: 10 }}>
        
        {/* Pane 1: Slim NavBar */}
        <div className="h-full rounded-2xl overflow-hidden shadow-2xl">
          <NavBar />
        </div>

        {/* Pane 2: Sidebar (Chat List) */}
        <div className="h-full rounded-2xl overflow-hidden shadow-2xl shrink-0">
          <Sidebar />
        </div>

        {/* Pane 3: Central Chat Window */}
        <div className="flex flex-1 h-full overflow-hidden relative rounded-2xl glass-panel shadow-2xl">
          <AnimatePresence mode="wait">
            {selectedChatId ? (
              <motion.div
                key={selectedChatId}
                className="flex flex-col flex-1 h-full overflow-hidden absolute inset-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ChatWindow />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                className="flex flex-col flex-1 h-full overflow-hidden absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <WelcomeScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pane 4: Right AI Profile Panel */}
        {selectedChatId && (
          <div className="h-full rounded-2xl overflow-hidden glass-panel shadow-2xl hidden lg:block shrink-0">
            <AIProfile />
          </div>
        )}

      </div>
    </main>
  );
}