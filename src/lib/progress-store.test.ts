import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  createEmptyProgress,
  parseProgress,
  PROGRESS_STORAGE_KEY,
} from "@/lib/progress"

type ProgressStore = typeof import("@/lib/progress-store")

const completedAt = new Date(2026, 8, 14, 10)

describe("progress store", () => {
  let store: ProgressStore

  beforeEach(async () => {
    localStorage.clear()
    vi.resetModules()
    store = await import("@/lib/progress-store")
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it("starts empty when nothing is stored", () => {
    expect(store.getProgressSnapshot()).toEqual(createEmptyProgress())
  })

  it("returns the same snapshot until progress changes", () => {
    const first = store.getProgressSnapshot()
    expect(store.getProgressSnapshot()).toBe(first)

    store.recordProgressAttempt({ topicId: "js", score: 7, completedAt })
    expect(store.getProgressSnapshot()).not.toBe(first)
  })

  it("persists recorded attempts to localStorage", () => {
    store.recordProgressAttempt({ topicId: "js", score: 7, completedAt })

    const saved = parseProgress(localStorage.getItem(PROGRESS_STORAGE_KEY))
    expect(saved.topics.js).toEqual({
      bestScore: 7,
      attempts: 1,
      lastScore: 7,
      lastPlayedAt: completedAt.toISOString(),
    })
    expect(store.getProgressSnapshot()).toEqual(saved)
  })

  it("falls back to empty when stored progress is corrupt", () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, "{not json")
    expect(store.getProgressSnapshot()).toEqual(createEmptyProgress())

    store.recordProgressAttempt({ topicId: "css", score: 9, completedAt })
    expect(store.getProgressSnapshot().topics.css.attempts).toBe(1)
  })

  it("keeps the attempt in memory when storage writes fail", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError")
    })
    const listener = vi.fn()
    store.subscribeToProgress(listener)

    expect(() =>
      store.recordProgressAttempt({ topicId: "ts", score: 4, completedAt })
    ).not.toThrow()
    expect(store.getProgressSnapshot().topics.ts.attempts).toBe(1)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("survives storage being unavailable entirely", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Access denied", "SecurityError")
    })
    expect(store.getProgressSnapshot()).toEqual(createEmptyProgress())
  })

  it("notifies subscribers of local and cross-tab changes", () => {
    const listener = vi.fn()
    const unsubscribe = store.subscribeToProgress(listener)

    store.recordProgressAttempt({ topicId: "html", score: 9, completedAt })
    expect(listener).toHaveBeenCalledTimes(1)

    localStorage.setItem(PROGRESS_STORAGE_KEY, "{}")
    window.dispatchEvent(
      new StorageEvent("storage", { key: PROGRESS_STORAGE_KEY })
    )
    expect(listener).toHaveBeenCalledTimes(2)
    expect(store.getProgressSnapshot()).toEqual(createEmptyProgress())

    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }))
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    window.dispatchEvent(new StorageEvent("storage", { key: null }))
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it("has no snapshot during server rendering", () => {
    expect(store.getServerProgressSnapshot()).toBeNull()
  })
})
