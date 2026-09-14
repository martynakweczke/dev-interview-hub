export const THEME_STORAGE_KEY = "theme"

export const THEME_PREFERENCES = ["system", "dark", "light"] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = Exclude<ThemePreference, "system">

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)"

export function parsePreference(value: unknown): ThemePreference {
  return value === "dark" || value === "light" ? value : "system"
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean
): ResolvedTheme {
  if (preference === "system") return systemPrefersDark ? "dark" : "light"
  return preference
}

export function applyResolvedTheme(root: HTMLElement, theme: ResolvedTheme) {
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export const themeInitScript = `(function(){var r=document.documentElement,t;try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});t=p==="dark"||p==="light"?p:matchMedia(${JSON.stringify(
  DARK_SCHEME_QUERY
)}).matches?"dark":"light"}catch(e){t="dark"}r.dataset.theme=t;r.style.colorScheme=t})()`
