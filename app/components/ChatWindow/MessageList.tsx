'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DateSeparator, { isSameCalendarDay } from './DateSeparator';

export default function MessageList() {
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const messages = useChatStore((s) =>
    selectedChatId ? (s.messages[selectedChatId] ?? []) : []
  );
  const isBotTyping = useChatStore((s) => s.isBotTyping);
  const selectedChat = useChatStore((s) =>
    s.chats.find((c) => c.id === s.selectedChatId)
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto z-0"
      style={{
        overscrollBehavior: 'contain',
        paddingTop: '24px',
        paddingBottom: '8px',
      }}
    >
      <div className="flex flex-col">
        {messages.map((msg, i) => {
          const showSeparator =
            i > 0 &&
            !isSameCalendarDay(msg.timestamp, messages[i - 1].timestamp);
          return (
            <div key={msg.id}>
              {showSeparator && <DateSeparator date={msg.timestamp} />}
              <MessageBubble
                message={msg}
                isConsecutive={
                  !showSeparator &&
                  i > 0 &&
                  messages[i - 1].isUser === msg.isUser &&
                  msg.timestamp.getTime() - messages[i - 1].timestamp.getTime() < 60000
                }
              />
            </div>
          );
        })}

        {/* Bot typing indicator */}
        {isBotTyping && selectedChat?.isBot && (
          <TypingIndicator key="typing-indicator" />
        )}
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-6" />
    </div>
  );
}
