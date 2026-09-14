import {
  applyResolvedTheme,
  DARK_SCHEME_QUERY,
  parsePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme"

export type ThemeSnapshot = {
  preference: ThemePreference
  resolved: ResolvedTheme
}

const listeners = new Set<() => void>()
let cached: ThemeSnapshot | null = null

function readStoredPreference(): ThemePreference {
  try {
    return parsePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return "system"
  }
}

export function getThemeSnapshot(): ThemeSnapshot {
  const preference = readStoredPreference()
  const resolved = resolveTheme(
    preference,
    window.matchMedia(DARK_SCHEME_QUERY).matches
  )
  if (cached?.preference !== preference || cached.resolved !== resolved) {
    cached = { preference, resolved }
  }
  return cached
}

export function getServerThemeSnapshot(): null {
  return null
}

function sync() {
  applyResolvedTheme(document.documentElement, getThemeSnapshot().resolved)
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === THEME_STORAGE_KEY) sync()
}

export function setThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {}
  sync()
}

/**
 * Subscribes to everything that can change the resolved theme: OS scheme
 * changes (which only matter while in "system") and edits from other tabs.
 */
export function subscribeToTheme(listener: () => void) {
  if (listeners.size === 0) {
    window.matchMedia(DARK_SCHEME_QUERY).addEventListener("change", sync)
    window.addEventListener("storage", onStorage)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.matchMedia(DARK_SCHEME_QUERY).removeEventListener("change", sync)
      window.removeEventListener("storage", onStorage)
    }
  }
}
