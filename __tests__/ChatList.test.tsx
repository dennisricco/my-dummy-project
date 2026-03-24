import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import ChatList from '../app/components/Sidebar/ChatList'
import { useChatStore } from '../app/store/useChatStore'
import { MOCK_CHATS } from '../app/data/mockData'

beforeEach(() => {
  useChatStore.setState({ chats: MOCK_CHATS })
})

// Feature: ui-enhancement, Property 4: Empty state ChatList menampilkan query aktif
describe('Property 4: Empty state contains active search query', () => {
  it('empty state text includes the search query when no chats match', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          // Prefix ensures no real chat matches
          const noMatchQuery = `__nomatch__${query}`
          const { unmount } = render(<ChatList searchQuery={noMatchQuery} />)

          const emptyState = screen.getByTestId('empty-state')
          expect(emptyState.textContent).toContain(noMatchQuery)

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: ui-enhancement, Property 5: ChatList kembali normal saat query dikosongkan
describe('Property 5: ChatList restores full list when query is cleared', () => {
  it('removes empty state when query is cleared', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          const noMatchQuery = `__nomatch__${query}`
          const { rerender, unmount } = render(<ChatList searchQuery={noMatchQuery} />)

          // Empty state should be visible
          expect(screen.getByTestId('empty-state')).toBeDefined()

          // Clear query
          rerender(<ChatList searchQuery="" />)

          // Empty state should be gone
          expect(screen.queryByTestId('empty-state')).toBeNull()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
