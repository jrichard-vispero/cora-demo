import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_PREFERENCES, loadPreferences, savePreferences } from './preferences'

describe('preferences', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts from the defaults', () => {
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
  })

  it('loads what was saved', () => {
    const saved = { notifyPlaced: false, notifyShipped: true, dailySummary: false, defaultWarehouse: 'savannah' } as const
    savePreferences(saved)
    expect(loadPreferences()).toEqual(saved)
  })

  it('falls back to the defaults for unreadable or invalid values', () => {
    localStorage.setItem('wrenmoor.preferences', '{not json')
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)

    localStorage.setItem(
      'wrenmoor.preferences',
      JSON.stringify({ notifyPlaced: 'yes', notifyShipped: true, defaultWarehouse: 'atlantis' }),
    )
    expect(loadPreferences()).toEqual({ ...DEFAULT_PREFERENCES, notifyShipped: true })
  })
})
