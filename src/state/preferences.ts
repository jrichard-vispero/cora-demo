import { WAREHOUSES } from '../data/types'
import type { Warehouse } from '../data/types'

export interface Preferences {
  notifyPlaced: boolean
  notifyShipped: boolean
  dailySummary: boolean
  defaultWarehouse: Warehouse
}

export const DEFAULT_PREFERENCES: Preferences = {
  notifyPlaced: true,
  notifyShipped: false,
  dailySummary: true,
  defaultWarehouse: 'reno',
}

const STORAGE_KEY = 'wrenmoor.preferences'

/** Reads the saved preferences, falling back to the defaults for anything missing or invalid. */
export function loadPreferences(): Preferences {
  let stored: unknown
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    return DEFAULT_PREFERENCES
  }
  if (typeof stored !== 'object' || stored === null) return DEFAULT_PREFERENCES

  const saved = stored as Record<string, unknown>
  const flag = (key: 'notifyPlaced' | 'notifyShipped' | 'dailySummary') =>
    typeof saved[key] === 'boolean' ? saved[key] : DEFAULT_PREFERENCES[key]
  return {
    notifyPlaced: flag('notifyPlaced'),
    notifyShipped: flag('notifyShipped'),
    dailySummary: flag('dailySummary'),
    defaultWarehouse: WAREHOUSES.find((warehouse) => warehouse === saved.defaultWarehouse) ?? DEFAULT_PREFERENCES.defaultWarehouse,
  }
}

/** Saves the preferences in this browser. Throws when the browser refuses to store them. */
export function savePreferences(preferences: Preferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}
