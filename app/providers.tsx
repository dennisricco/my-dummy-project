'use client';

import { useEffect } from 'react';
import { useChatStore } from './store/useChatStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useChatStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
