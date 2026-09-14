"use client"

import { useEffect } from "react"

import { subscribeToTheme } from "@/lib/theme-store"

export function ThemeSync() {
  useEffect(() => subscribeToTheme(() => {}), [])
  return null
}
