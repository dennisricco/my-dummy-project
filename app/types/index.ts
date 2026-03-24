export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  avatar: string; // emoji or initials
  isOnline: boolean;
  isBot?: boolean;
  statusMessage?: string;
  email?: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: string; // user id
  content: string;
  timestamp: Date;
  isBot: boolean;
  isUser: boolean; // sent by the "me" user
}

export interface Chat {
  id: string;
  participant: User;
  lastMessage: string;
  lastTimestamp: Date;
  unreadCount: number;
  isBot?: boolean;
}

export type FriendRequestStatus = 'none' | 'pending' | 'accepted';

export interface FriendSearchResult extends User {
  friendStatus: FriendRequestStatus;
}
