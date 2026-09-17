import {
  parseProgress,
  PROGRESS_STORAGE_KEY,
  recordAttempt,
  serializeProgress,
  type Attempt,
  type ProgressSnapshot,
} from "@/features/progress/services/progress/progress"

const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cached: ProgressSnapshot | null = null

function readStoredProgress(): string | null {
  try {
    return window.localStorage.getItem(PROGRESS_STORAGE_KEY)
  } catch {
    return null
  }
}

export function getProgressSnapshot(): ProgressSnapshot {
  const raw = readStoredProgress()
  if (cached === null || raw !== cachedRaw) {
    cachedRaw = raw
    cached = parseProgress(raw)
  }
  return cached
}

export function getServerProgressSnapshot(): null {
  return null
}

function notify() {
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === PROGRESS_STORAGE_KEY) notify()
}

export function recordProgressAttempt(attempt: Attempt) {
  const next = recordAttempt(getProgressSnapshot(), attempt)
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(next))
  } catch {}
  cachedRaw = readStoredProgress()
  cached = next
  notify()
}

export function subscribeToProgress(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage)
    }
  }
}
