import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import {
  toggleMode,
  validateEmail,
  validatePasswordMin,
  validatePasswordMatch,
  validateRequired,
} from '../app/login/validation'

// Feature: login-register-redesign, Property 1: toggleMode(toggleMode(m)) === m for any mode
describe('Property 1: toggleMode is an involution', () => {
  it('toggleMode(toggleMode(m)) === m for any mode', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('login' as const, 'register' as const),
        (mode) => toggleMode(toggleMode(mode)) === mode
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: login-register-redesign, Property 2: validateEmail returns non-null for strings without @
describe('Property 2: validateEmail rejects strings without @', () => {
  it('returns non-null for any string without @', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('@')),
        (s) => validateEmail(s) !== null
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: login-register-redesign, Property 3: validateEmail returns null for valid email addresses
describe('Property 3: validateEmail accepts valid email addresses', () => {
  it('returns null for fc.emailAddress() generated emails', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => validateEmail(email) === null
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: login-register-redesign, Property 4: validatePasswordMin returns non-null for strings shorter than 8 chars
describe('Property 4: validatePasswordMin rejects strings shorter than 8 chars', () => {
  it('returns non-null for any string with length < 8', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 7 }),
        (s) => validatePasswordMin(s) !== null
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: login-register-redesign, Property 5: validatePasswordMatch(a,b) === null iff a === b
describe('Property 5: validatePasswordMatch null iff strings are equal', () => {
  it('returns null iff a === b', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (a, b) => (a === b) === (validatePasswordMatch(a, b) === null)
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: login-register-redesign, Property 6: validateRequired returns non-null for whitespace-only strings
describe('Property 6: validateRequired rejects whitespace-only strings', () => {
  it('returns non-null for any whitespace-only string', () => {
    fc.assert(
      fc.property(
        // Build a whitespace-only string from an array of whitespace chars (minLength: 1 ensures non-empty)
        fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1 }).map((chars) => chars.join('')),
        (s) => validateRequired(s) !== null
      ),
      { numRuns: 100 }
    )
  })
})
