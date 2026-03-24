'use client';

import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputBar from './InputBar';

export default function ChatWindow() {
  return (
    <div
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ transition: 'background-color 300ms ease' }}
    >
      <ChatHeader />
      <MessageList />
      <InputBar />
    </div>
  );
}
