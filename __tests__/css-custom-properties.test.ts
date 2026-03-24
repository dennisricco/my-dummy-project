import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'

// Parse CSS custom property values directly from globals.css
// since jsdom doesn't process @import or real CSS files
const cssContent = fs.readFileSync(
  path.resolve(__dirname, '../app/globals.css'),
  'utf-8'
)

function extractRootVar(name: string): string | null {
  // Match inside :root { ... }
  const rootBlock = cssContent.match(/:root\s*\{([^}]+)\}/)
  if (!rootBlock) return null
  const match = rootBlock[1].match(new RegExp(`${name}\\s*:\\s*([^;]+);`))
  return match ? match[1].trim() : null
}

function extractLightVar(name: string): string | null {
  // Match inside [data-theme="light"] { ... }
  const lightBlock = cssContent.match(/\[data-theme="light"\]\s*\{([^}]+)\}/)
  if (!lightBlock) return null
  const match = lightBlock[1].match(new RegExp(`${name}\\s*:\\s*([^;]+);`))
  return match ? match[1].trim() : null
}

// Convert hex color to HSL lightness (0-100)
function hexToLightness(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return ((max + min) / 2) * 100
}

describe('CSS custom properties — dark mode (:root)', () => {
  it('--text-muted is not #7dd3fc', () => {
    const val = extractRootVar('--text-muted')
    expect(val).not.toBe('#7dd3fc')
  })

  it('--text-muted dark mode is #94a3b8', () => {
    const val = extractRootVar('--text-muted')
    expect(val).toBe('#94a3b8')
  })
})

describe('CSS custom properties — light mode ([data-theme="light"])', () => {
  it('--bg-primary has lightness >= 90%', () => {
    const val = extractLightVar('--bg-primary')
    expect(val).toBeTruthy()
    const lightness = hexToLightness(val!)
    expect(lightness).toBeGreaterThanOrEqual(90)
  })

  it('--text-primary is a dark color', () => {
    const val = extractLightVar('--text-primary')
    expect(val).toBeTruthy()
    const lightness = hexToLightness(val!)
    // Dark color = lightness < 30%
    expect(lightness).toBeLessThan(30)
  })

  it('--text-muted light mode is #64748b', () => {
    const val = extractLightVar('--text-muted')
    expect(val).toBe('#64748b')
  })
})
