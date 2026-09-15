"use client"

import { useSyncExternalStore } from "react"

import { createEmptyProgress, type ProgressSnapshot } from "@/lib/progress"
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeToProgress,
} from "@/lib/progress-store"

const emptyProgress = createEmptyProgress()

export function useProgress(): ProgressSnapshot {
  const snapshot = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerProgressSnapshot
  )
  return snapshot ?? emptyProgress
}
