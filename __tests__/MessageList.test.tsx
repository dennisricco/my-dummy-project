import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import * as fc from 'fast-check'
import MessageList from '../app/components/ChatWindow/MessageList'
import { useChatStore } from '../app/store/useChatStore'
import { isSameCalendarDay } from '../app/components/ChatWindow/DateSeparator'
import type { Message } from '../app/types'

// jsdom doesn't implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()

const CHAT_ID = 'test-chat'

const BASE_STATE = {
  selectedChatId: CHAT_ID,
  messages: { [CHAT_ID]: [] as Message[] },
  isBotTyping: false,
  chats: [
    {
      id: CHAT_ID,
      participant: { id: 'u1', name: 'Test', avatar: '👤', isOnline: true },
      lastMessage: '',
      lastTimestamp: new Date(),
      unreadCount: 0,
      isBot: false,
    },
  ],
}

function makeMessages(timestamps: Date[]): Message[] {
  return timestamps.map((ts, i) => ({
    id: `msg-${i}`,
    chatId: CHAT_ID,
    sender: 'me',
    content: `Message ${i}`,
    timestamp: ts,
    isBot: false,
    isUser: true,
  }))
}

// Separators only at day transitions (i > 0), never before the first message
function countExpectedSeparators(messages: Message[]): number {
  let count = 0
  for (let i = 1; i < messages.length; i++) {
    if (!isSameCalendarDay(messages[i].timestamp, messages[i - 1].timestamp)) {
      count++
    }
  }
  return count
}

beforeEach(() => {
  act(() => { useChatStore.setState(BASE_STATE) })
})

// Feature: ui-enhancement, Property 2: DateSeparator muncul tepat di setiap transisi hari kalender
describe('Property 2: DateSeparator appears at every calendar day transition', () => {
  it('renders exactly the right number of date separators for any message array', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.array(fc.date(), { minLength: 1, maxLength: 20 }),
        (timestamps) => {
          const messages = makeMessages(timestamps)
          act(() => { useChatStore.setState({ messages: { [CHAT_ID]: messages } }) })

          const { unmount } = render(<MessageList />)
          const separators = screen.queryAllByTestId('date-separator')
          const expected = countExpectedSeparators(messages)
          const ok = separators.length === expected

          unmount()
          act(() => { useChatStore.setState(BASE_STATE) })
          return ok
        }
      ),
      { numRuns: 50 }
    )
  })

  it('renders no separator when all messages are from the same day', () => {
    const today = new Date()
    const messages = makeMessages([
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
    ])
    act(() => { useChatStore.setState({ messages: { [CHAT_ID]: messages } }) })
    render(<MessageList />)
    expect(screen.queryAllByTestId('date-separator').length).toBe(0)
  })

  it('renders one separator between two messages from different days', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const messages = makeMessages([yesterday, today])
    act(() => { useChatStore.setState({ messages: { [CHAT_ID]: messages } }) })
    render(<MessageList />)
    expect(screen.queryAllByTestId('date-separator').length).toBe(1)
  })
})
