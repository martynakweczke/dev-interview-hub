import { render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ProgressView } from "./progress-view"
import {
  createEmptyProgress,
  PROGRESS_STORAGE_KEY,
  serializeProgress,
  type ProgressSnapshot,
  type TopicProgress,
} from "@/features/progress/services/progress/progress"

const day = (date: number, hour = 10) => new Date(2026, 8, date, hour)

function played(
  bestScore: number,
  lastScore: number,
  attempts: number,
  on: Date
): TopicProgress {
  return { bestScore, attempts, lastScore, lastPlayedAt: on.toISOString() }
}

function seed(progress: ProgressSnapshot) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress))
}

function topicItems() {
  return screen.getAllByRole("listitem").map((item) => ({
    card: within(item).getByRole("link"),
    history: within(item)
      .getAllByRole("definition")
      .map((value) => value.textContent),
  }))
}

describe("ProgressView", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(day(14, 12))
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it("shows the untouched state when nothing is stored", () => {
    render(<ProgressView />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Your progress" })
    ).toBeInTheDocument()
    expect(screen.queryByText(/-day streak/)).not.toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Overall accuracy" })
    ).toHaveAttribute("aria-valuenow", "0")
    expect(
      screen.getByText("Play your first round to get started")
    ).toBeInTheDocument()

    const items = topicItems()
    expect(items.map(({ card }) => card.getAttribute("href"))).toEqual([
      "/quiz/css",
      "/quiz/html",
      "/quiz/js",
      "/quiz/ts",
    ])
    for (const { card, history } of items) {
      expect(within(card).getByText("Not attempted yet")).toBeInTheDocument()
      expect(within(card).getByText("Start your first round")).toBeInTheDocument()
      expect(history).toEqual(["0", "—", "—"])
    }
  })

  it("reflects stored progress in topic order", () => {
    const empty = createEmptyProgress()
    seed({
      ...empty,
      topics: {
        ...empty.topics,
        css: played(10, 10, 4, day(12)),
        js: played(8, 6, 3, day(14, 9)),
      },
      streakDays: 3,
    })
    render(<ProgressView />)

    expect(screen.getByText("3-day streak")).toBeInTheDocument()
    expect(screen.getByText("18 of 40 questions mastered")).toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Overall accuracy" })
    ).toHaveAttribute("aria-valuenow", "45")

    const [css, html, js, ts] = topicItems()
    expect(within(css.card).getByText("Last played 2 days ago")).toBeInTheDocument()
    expect(css.history).toEqual(["4", "10/10", "2 days ago"])
    expect(within(html.card).getByText("Not attempted yet")).toBeInTheDocument()
    expect(within(js.card).getByText("4 questions to review")).toBeInTheDocument()
    expect(within(js.card).getByText("8/10", { exact: false })).toBeInTheDocument()
    expect(js.history).toEqual(["3", "6/10", "today"])
    expect(ts.history).toEqual(["0", "—", "—"])
  })
})
