"use client"

import { useSyncExternalStore } from "react"

import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setThemePreference,
  subscribeToTheme,
} from "@/lib/theme-store"

export function useTheme() {
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  )
  return { snapshot, setPreference: setThemePreference }
}
