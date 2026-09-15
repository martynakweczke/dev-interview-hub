import { act, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { HomeView } from "@/components/home/home-view"
import {
  createEmptyProgress,
  PROGRESS_STORAGE_KEY,
  serializeProgress,
  type ProgressSnapshot,
  type TopicProgress,
} from "@/lib/progress"

const day = (date: number, hour = 10) => new Date(2026, 8, date, hour)

function played(bestScore: number, lastScore: number, on: Date): TopicProgress {
  return { bestScore, attempts: 3, lastScore, lastPlayedAt: on.toISOString() }
}

function seed(progress: ProgressSnapshot) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress))
}

function topicCards() {
  return screen
    .getAllByRole("listitem")
    .map((item) => within(item).getByRole("link"))
}

describe("HomeView", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(day(14, 12))
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it("shows every topic untouched when nothing is stored", () => {
    render(<HomeView />)

    const cards = topicCards()
    expect(cards.map((card) => card.getAttribute("href"))).toEqual([
      "/quiz/css",
      "/quiz/html",
      "/quiz/js",
      "/quiz/ts",
    ])
    for (const card of cards) {
      expect(within(card).getByText("Not attempted yet")).toBeInTheDocument()
      expect(within(card).getByText("Start your first round")).toBeInTheDocument()
      expect(card).toHaveAttribute("data-variant", "glass")
    }

    expect(screen.queryByText(/streak/)).not.toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Overall accuracy" })
    ).toHaveAttribute("aria-valuenow", "0")
    expect(
      screen.getByText("Play your first round to get started")
    ).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /^Resume/ })).not.toBeInTheDocument()
  })

  it("reflects stored progress", () => {
    const empty = createEmptyProgress()
    seed({
      ...empty,
      topics: {
        ...empty.topics,
        css: played(10, 10, day(12)),
        html: played(9, 9, day(9)),
        js: played(7, 7, day(13)),
      },
      streakDays: 4,
    })
    render(<HomeView />)

    const cards = topicCards()
    expect(cards.map((card) => card.getAttribute("href"))).toEqual([
      "/quiz/ts",
      "/quiz/js",
      "/quiz/html",
      "/quiz/css",
    ])

    const [ts, js, html, css] = cards
    expect(within(ts).getByText("Start your first round")).toBeInTheDocument()
    expect(within(js).getByText("3 questions to review")).toBeInTheDocument()
    expect(within(html).getByText("1 question to review")).toBeInTheDocument()
    expect(within(css).getByText("Last played 2 days ago")).toBeInTheDocument()
    expect(within(css).getByText("10/10", { exact: false })).toBeInTheDocument()

    expect(js).toHaveAttribute("data-variant", "focus")
    expect(cards.filter((card) => card.dataset.variant === "focus")).toHaveLength(1)

    expect(screen.getByText("4-day streak")).toBeInTheDocument()
    expect(screen.getByText("26 of 40 questions mastered")).toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Overall accuracy" })
    ).toHaveAttribute("aria-valuenow", "65")
    expect(
      screen.getByRole("link", { name: "Resume JavaScript round" })
    ).toHaveAttribute("href", "/quiz/js")
  })

  it("updates when another tab records progress", () => {
    render(<HomeView />)
    expect(screen.queryByText(/streak/)).not.toBeInTheDocument()

    const empty = createEmptyProgress()
    act(() => {
      seed({
        ...empty,
        topics: { ...empty.topics, ts: played(6, 6, day(14, 9)) },
        streakDays: 1,
      })
      window.dispatchEvent(
        new StorageEvent("storage", { key: PROGRESS_STORAGE_KEY })
      )
    })

    expect(screen.getByText("1-day streak")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Resume TypeScript round" })
    ).toBeInTheDocument()
  })
})
