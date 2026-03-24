import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WelcomeScreen from '../app/components/WelcomeScreen'

// Unit test: exactly 1 OrbitRing rendered
describe('WelcomeScreen — OrbitRing count', () => {
  it('renders exactly 1 orbit ring', () => {
    render(<WelcomeScreen />)
    expect(screen.getAllByTestId('orbit-ring').length).toBe(1)
  })
})

// Feature: ui-enhancement, Property 8: OrbitRing opacity tidak melebihi batas
describe('Property 8: OrbitRing opacity does not exceed 0.2', () => {
  it('all orbit rings have opacity <= 0.2', () => {
    render(<WelcomeScreen />)
    const rings = screen.getAllByTestId('orbit-ring')
    rings.forEach((ring) => {
      const inlineOpacity = ring.style.opacity
      // If inline opacity is set, it must be <= 0.2
      if (inlineOpacity !== '') {
        expect(parseFloat(inlineOpacity)).toBeLessThanOrEqual(0.2)
      }
      // If no inline opacity, check className for Tailwind opacity utilities
      // e.g. opacity-0, opacity-5, opacity-10, opacity-20 are all <= 0.2
      // opacity-25 or higher would violate the constraint
      const classList = ring.className
      const tailwindOpacityMatch = classList.match(/\bopacity-(\d+)\b/)
      if (tailwindOpacityMatch) {
        const opacityValue = parseInt(tailwindOpacityMatch[1], 10) / 100
        expect(opacityValue).toBeLessThanOrEqual(0.2)
      }
    })
  })
})
