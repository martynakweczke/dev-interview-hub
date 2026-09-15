"use client"

import { useMemo, useSyncExternalStore } from "react"

const CHECK_INTERVAL_MS = 60 * 1000

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, CHECK_INTERVAL_MS)
  return () => window.clearInterval(id)
}

function getToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function getServerToday() {
  return 0
}

export function useToday(): Date {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday)
  return useMemo(() => new Date(today), [today])
}
