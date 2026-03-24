import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as fc from 'fast-check'
import NavBar from '../app/components/NavBar'
import { useChatStore } from '../app/store/useChatStore'

// Reset store state before each test
beforeEach(() => {
  useChatStore.setState({ theme: 'dark' })
})

// Task 1.1 — Exploratory Bug Condition: confirm mb-10 exists on logo element (unfixed code)
// This test PASSES on unfixed code (bug present) and FAILS after the fix is applied.
describe('Bug Condition 1.1: Logo element has mb-10 class (unfixed code)', () => {
  it('logo motion.div contains mb-10 class', () => {
    const { container } = render(<NavBar />)
    // The brand logo is the first motion.div inside the NavBar
    const logoDivs = container.querySelectorAll('.mb-10')
    expect(logoDivs.length).toBeGreaterThan(0)
  })
})

// Feature: ui-enhancement, Property 7: ThemeToggle menampilkan ikon yang sesuai state
describe('Property 7: ThemeToggle icon matches theme state', () => {
  it('renders Sun icon when theme is dark, Moon icon when theme is light', () => {
    fc.assert(
      fc.property(fc.constantFrom('dark' as const, 'light' as const), (theme) => {
        useChatStore.setState({ theme })
        const { unmount } = render(<NavBar />)
        if (theme === 'dark') {
          expect(screen.getByTestId('icon-sun')).toBeDefined()
          expect(screen.queryByTestId('icon-moon')).toBeNull()
        } else {
          expect(screen.getByTestId('icon-moon')).toBeDefined()
          expect(screen.queryByTestId('icon-sun')).toBeNull()
        }
        unmount()
      }),
      { numRuns: 100 }
    )
  })
})

// Feature: ui-enhancement, Property 6: Tooltip NavBar mengikuti hover state
describe('Property 6: NavBar tooltip follows hover state', () => {
  it('shows tooltip on mouseenter and hides on mouseleave for all nav buttons', () => {
    // Nav item indices 0-3 (Home, Chats, AI Assistant, Search)
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 3 }), (itemIndex) => {
        const { unmount } = render(<NavBar />)
        const buttons = screen.getAllByRole('button')

        // No native title attribute
        expect(buttons[itemIndex]).not.toHaveAttribute('title')

        // Tooltip absent before hover
        expect(screen.queryByRole('tooltip')).toBeNull()

        // Show on mouseenter — tooltip should be in DOM
        fireEvent.mouseEnter(buttons[itemIndex])
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toBeDefined()

        // Hide on mouseleave — AnimatePresence keeps element in DOM during exit animation
        // but it should have opacity 0 (exit state) or be removed
        fireEvent.mouseLeave(buttons[itemIndex])
        const tooltipAfter = screen.queryByRole('tooltip')
        if (tooltipAfter) {
          // Still in DOM during exit animation — opacity should be 0
          expect(tooltipAfter.style.opacity).toBe('0')
        }
        // else: fully removed — also valid

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})

// Task 1.2 — Exploratory Bug Condition: confirm spacing inconsistency between logo margin and nav gap
// Logo uses mb-10 (40px) while nav items container uses gap-8 (32px) — inconsistency confirmed.
// This test PASSES on unfixed code (bug present) and FAILS after the fix is applied.
describe('Bug Condition 1.2: Spacing inconsistency between logo mb-10 and nav gap-8', () => {
  it('logo has mb-10 class and nav items container has gap-8 class (inconsistency exists)', () => {
    const { container } = render(<NavBar />)

    // Assert logo element has mb-10
    const logoWithMb10 = container.querySelectorAll('.mb-10')
    expect(logoWithMb10.length).toBeGreaterThan(0)

    // Assert nav items container has gap-8
    const navWithGap8 = container.querySelectorAll('.gap-8')
    expect(navWithGap8.length).toBeGreaterThan(0)

    // Together these confirm the inconsistency: logo uses mb-10 (40px) while nav gap is gap-8 (32px)
    // mb-10 !== mb-8 proves the values are not the same class
    expect(logoWithMb10[0].classList.contains('mb-8')).toBe(false)
  })
})

// Task 3.1 — Fix Checking: verify logo no longer has mb-10 class after fix
describe('Fix Check 3.1: Logo element no longer has mb-10 class', () => {
  it('no element in NavBar has mb-10 class after fix', () => {
    const { container } = render(<NavBar />)
    // Check className strings directly since Tailwind classes aren't processed in test env
    const allElements = container.querySelectorAll('*')
    const hasMb10 = Array.from(allElements).some(
      (el) => el.className && typeof el.className === 'string' && el.className.split(' ').includes('mb-10')
    )
    expect(hasMb10).toBe(false)
  })
})

// Task 3.2 — Fix Checking: verify logo has the new spacing class after fix
describe('Fix Check 3.2: Logo element has new spacing class after fix', () => {
  it('logo motion.div has a valid replacement spacing class (mb-8, mb-14, mb-16, or mb-20)', () => {
    const { container } = render(<NavBar />)
    const validClasses = ['mb-8', 'mb-14', 'mb-16', 'mb-20']
    const allElements = container.querySelectorAll('*')
    const hasValidSpacing = Array.from(allElements).some(
      (el) =>
        el.className &&
        typeof el.className === 'string' &&
        el.className.split(' ').some((cls) => validClasses.includes(cls))
    )
    expect(hasValidSpacing).toBe(true)
  })
})

// Task 4.1 — Preservation: nav items container still uses gap-8
describe('Preservation 4.1: Nav items container still uses gap-8', () => {
  it('nav items container has gap-8 class', () => {
    const { container } = render(<NavBar />)
    const allElements = container.querySelectorAll('*')
    const hasGap8 = Array.from(allElements).some(
      (el) => el.className && typeof el.className === 'string' && el.className.split(' ').includes('gap-8')
    )
    expect(hasGap8).toBe(true)
  })
})

// Task 4.2 — Preservation: logo still has w-14, h-14, rounded-[16px] classes
describe('Preservation 4.2: Logo still has w-14, h-14, rounded-[16px] classes', () => {
  it('logo element has w-14, h-14, and rounded-[16px] classes', () => {
    const { container } = render(<NavBar />)
    const allElements = Array.from(container.querySelectorAll('*'))
    const logoEl = allElements.find(
      (el) =>
        el.className &&
        typeof el.className === 'string' &&
        el.className.split(' ').includes('w-14') &&
        el.className.split(' ').includes('h-14') &&
        el.className.split(' ').includes('rounded-[16px]')
    )
    expect(logoEl).toBeDefined()
  })
})

// Task 4.3 — Preservation: all 4 nav items (Home, Chats, AI Assistant, Search) still render
describe('Preservation 4.3: All 4 nav items still render', () => {
  it('renders Home, Chats, AI Assistant, and Search nav items', () => {
    render(<NavBar />)
    // Trigger hover on each button to reveal tooltips and verify labels
    const buttons = screen.getAllByRole('button')
    const labels = ['Home', 'Chats', 'AI Assistant', 'Search']
    labels.forEach((label, i) => {
      fireEvent.mouseEnter(buttons[i])
      expect(screen.getByText(label)).toBeDefined()
      fireEvent.mouseLeave(buttons[i])
    })
  })
})

// Task 4.4 — Preservation: bottom actions (theme toggle, user avatar) still render
describe('Preservation 4.4: Bottom actions still render', () => {
  it('renders theme toggle button and user avatar', () => {
    render(<NavBar />)
    // Theme toggle: Sun icon visible in dark mode (default)
    expect(screen.getByTestId('icon-sun')).toBeDefined()

    // User avatar: trigger hover on the theme toggle button to confirm it's a button
    const buttons = screen.getAllByRole('button')
    // There are 4 nav buttons + 1 theme toggle = 5 buttons total
    expect(buttons.length).toBeGreaterThanOrEqual(5)

    // User avatar div is present — it contains a User icon (no role, but it's in the bottom section)
    const { container } = render(<NavBar />)
    const allElements = Array.from(container.querySelectorAll('*'))
    const avatarEl = allElements.find(
      (el) =>
        el.className &&
        typeof el.className === 'string' &&
        el.className.split(' ').includes('rounded-full') &&
        el.className.split(' ').includes('w-12') &&
        el.className.split(' ').includes('h-12')
    )
    expect(avatarEl).toBeDefined()
  })
})
