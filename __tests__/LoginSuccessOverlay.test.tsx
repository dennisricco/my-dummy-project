import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useChatStore } from '../app/store/useChatStore'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(actual.motion, {
      get: (target, prop: string) => {
        if (prop in target) return (target as Record<string, unknown>)[prop]
        return ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
          const Tag = prop as keyof JSX.IntrinsicElements
          return <Tag {...(props as object)}>{children}</Tag>
        }
      },
    }),
  }
})

import LoginPage from '../app/login/page'

beforeEach(() => {
  useChatStore.setState({ isAuthenticated: false, theme: 'light' })
  // Reset window.innerWidth to desktop default
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 })
})

// ─── SuccessOverlay ───────────────────────────────────────────────────────────

describe('SuccessOverlay appears after valid login submit', () => {
  it('shows success overlay after submitting valid login credentials', async () => {
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
    })

    expect(screen.getByTestId('success-overlay')).toBeDefined()
    expect(screen.getByText("You're in")).toBeDefined()
  })
})

// ─── Mobile layout — LeftPanel not rendered ───────────────────────────────────

describe('LeftPanel not rendered on mobile viewport', () => {
  it('does not render LeftPanel when window.innerWidth < 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    // Trigger resize event so the component picks up the new width
    fireEvent(window, new Event('resize'))

    const { container } = render(<LoginPage />)

    const leftPanel = container.querySelector('.auth-left-panel')
    expect(leftPanel).toBeNull()
  })

  it('renders LeftPanel when window.innerWidth >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    fireEvent(window, new Event('resize'))

    const { container } = render(<LoginPage />)

    const leftPanel = container.querySelector('.auth-left-panel')
    expect(leftPanel).not.toBeNull()
  })
})
