import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useChatStore } from '../app/store/useChatStore'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

// Mock framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(actual.motion, {
      get: (target, prop: string) => {
        if (prop in target) return (target as Record<string, unknown>)[prop]
        // Return a plain element for any motion.X
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
})

// ─── LoginForm render ─────────────────────────────────────────────────────────

describe('LoginForm render', () => {
  it('renders email input, password input, Google button, divider, and CTA', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Password')).toBeDefined()
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeDefined()
    expect(screen.getByText(/or continue with email address/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })

  it('renders Sign in heading and Welcome back subtitle', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeDefined()
    expect(screen.getByText('Welcome back')).toBeDefined()
  })
})

// ─── LoginForm validation ─────────────────────────────────────────────────────

describe('LoginForm submit with empty fields', () => {
  it('shows errors and does not navigate when fields are empty', () => {
    render(<LoginPage />)

    const submitBtn = screen.getByRole('button', { name: /^sign in$/i })
    fireEvent.click(submitBtn)

    // Error messages should appear
    expect(screen.getByText('Please enter a valid email address')).toBeDefined()
    expect(screen.getByText('This field is required')).toBeDefined()

    // SuccessOverlay should NOT appear
    expect(screen.queryByTestId('success-overlay')).toBeNull()
  })
})

// ─── Switch to RegisterForm ───────────────────────────────────────────────────

describe('RegisterForm render', () => {
  it('renders username, email, password, confirm, Google button after switching to register', () => {
    render(<LoginPage />)

    // Switch to register mode
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByLabelText('Username')).toBeDefined()
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Password')).toBeDefined()
    expect(screen.getByLabelText('Confirm Password')).toBeDefined()
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeDefined()
  })

  it('renders Create account heading and Join us today subtitle', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByRole('heading', { level: 1, name: 'Create account' })).toBeDefined()
    expect(screen.getByText('Join us today')).toBeDefined()
  })
})

// ─── RegisterForm validation ──────────────────────────────────────────────────

describe('RegisterForm submit with password mismatch', () => {
  it('shows "Passwords do not match" error', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different456' } })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Passwords do not match')).toBeDefined()
    expect(screen.queryByTestId('success-overlay')).toBeNull()
  })
})

// ─── Property 7: every input has a matching label via htmlFor ─────────────────

// Feature: login-register-redesign, Property 7: every rendered input has a matching label with htmlFor
describe('Property 7: every input field has a label with matching htmlFor', () => {
  it('LoginForm — all inputs have a corresponding label', () => {
    const { container } = render(<LoginPage />)

    const inputs = Array.from(container.querySelectorAll('input:not([type="file"])'))
    inputs.forEach((input) => {
      const id = input.getAttribute('id')
      if (!id) return
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label, `Expected label[for="${id}"] to exist`).not.toBeNull()
    })
  })

  it('RegisterForm — all inputs have a corresponding label', () => {
    const { container } = render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    const inputs = Array.from(container.querySelectorAll('input:not([type="file"])'))
    inputs.forEach((input) => {
      const id = input.getAttribute('id')
      if (!id) return
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label, `Expected label[for="${id}"] to exist`).not.toBeNull()
    })
  })
})
