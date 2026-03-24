import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import AIProfile from '../app/components/AIProfile'
import { useChatStore } from '../app/store/useChatStore'
import { MOCK_CHATS } from '../app/data/mockData'

const BOT_CHAT = MOCK_CHATS.find((c) => c.isBot)!
const USER_CHAT = MOCK_CHATS.find((c) => !c.isBot)!

beforeEach(() => {
  useChatStore.setState({ chats: MOCK_CHATS, selectedChatId: null })
})

// ── Unit tests ────────────────────────────────────────────────────────────────

describe('AIProfile — unit tests', () => {
  it('renders placeholder state when no chat is selected', () => {
    useChatStore.setState({ selectedChatId: null })
    render(<AIProfile />)
    expect(screen.getByTestId('placeholder-state')).toBeDefined()
    expect(screen.queryByTestId('bot-stats')).toBeNull()
  })

  it('does not show bot stats for a non-bot chat', () => {
    useChatStore.setState({ selectedChatId: USER_CHAT.id })
    render(<AIProfile />)
    expect(screen.queryByTestId('bot-stats')).toBeNull()
  })
})

// Feature: ui-enhancement, Property 1: AIProfile bot menampilkan konten yang cukup
describe('Property 1: AIProfile bot renders sufficient content', () => {
  it('renders >= 6 stat rows and >= 3 quick action buttons for any bot chat', () => {
    fc.assert(
      fc.property(fc.constant(BOT_CHAT.id), (chatId) => {
        useChatStore.setState({ selectedChatId: chatId })
        const { unmount } = render(<AIProfile />)

        // 6 stat rows
        const statRows = screen.getAllByTestId(/^stat-/)
        expect(statRows.length).toBeGreaterThanOrEqual(6)

        // 3 quick action buttons
        const actions = screen.getAllByTestId(/^action-/)
        expect(actions.length).toBeGreaterThanOrEqual(3)

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
