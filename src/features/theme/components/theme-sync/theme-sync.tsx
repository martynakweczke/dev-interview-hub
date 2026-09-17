"use client"

import { useEffect } from "react"

import { subscribeToTheme } from "@/features/theme/services/theme-store/theme-store"

export function ThemeSync() {
  useEffect(() => subscribeToTheme(() => {}), [])
  return null
}
