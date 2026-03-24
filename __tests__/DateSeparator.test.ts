import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { getDateLabel, isSameCalendarDay } from '../app/components/ChatWindow/DateSeparator'

// Helper
function yesterday(): Date {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d
}

// ── Unit tests ────────────────────────────────────────────────────────────────

describe('getDateLabel — unit tests', () => {
  it('returns "Today" for today', () => {
    expect(getDateLabel(new Date())).toBe('Today')
  })

  it('returns "Yesterday" for yesterday', () => {
    expect(getDateLabel(yesterday())).toBe('Yesterday')
  })

  it('returns a non-empty string for an older date', () => {
    const label = getDateLabel(new Date('2020-01-01'))
    expect(label.length).toBeGreaterThan(0)
  })

  it('returns empty string for Invalid Date without throwing', () => {
    expect(() => getDateLabel(new Date('invalid'))).not.toThrow()
    expect(getDateLabel(new Date('invalid'))).toBe('')
  })
})

// ── Property 3: Label DateSeparator sesuai tanggal relatif ───────────────────
// Feature: ui-enhancement, Property 3: Label DateSeparator sesuai tanggal relatif

describe('Property 3: getDateLabel returns correct relative label for any date', () => {
  it('returns Today / Yesterday / non-empty string for any valid date', () => {
    const now = new Date()
    const yest = yesterday()

    fc.assert(
      fc.property(fc.date(), (date) => {
        const label = getDateLabel(date)
        if (isSameCalendarDay(date, now)) {
          expect(label).toBe('Today')
        } else if (isSameCalendarDay(date, yest)) {
          expect(label).toBe('Yesterday')
        } else {
          expect(label.length).toBeGreaterThan(0)
        }
      }),
      { numRuns: 100 }
    )
  })
})
