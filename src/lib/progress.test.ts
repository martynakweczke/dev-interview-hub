import { describe, expect, it } from "vitest"

import {
  createEmptyProgress,
  getCurrentStreak,
  getLastPlayedAt,
  parseProgress,
  PROGRESS_SCHEMA_VERSION,
  recordAttempt,
  serializeProgress,
  type ProgressSnapshot,
  type TopicProgress,
} from "@/lib/progress"

const day = (date: number, hour = 10) => new Date(2026, 8, date, hour)

const played: TopicProgress = {
  bestScore: 8,
  attempts: 3,
  lastScore: 6,
  lastPlayedAt: day(12).toISOString(),
}

function stored(overrides: Record<string, unknown>) {
  return JSON.stringify({
    version: PROGRESS_SCHEMA_VERSION,
    topics: {},
    streakDays: 0,
    ...overrides,
  })
}

describe("parseProgress", () => {
  it("returns an empty snapshot when nothing is stored", () => {
    const empty = parseProgress(null)
    expect(empty).toEqual(createEmptyProgress())
    expect(empty.topics.ts).toEqual({
      bestScore: 0,
      attempts: 0,
      lastScore: null,
      lastPlayedAt: null,
    })
  })

  it.each([
    ["an empty string", ""],
    ["truncated JSON", '{"version":1,"topics":'],
    ["null", "null"],
    ["an array", "[]"],
    ["a string", '"progress"'],
    ["a number", "42"],
  ])("falls back to empty for %s", (_label, raw) => {
    expect(parseProgress(raw)).toEqual(createEmptyProgress())
  })

  it.each([
    ["a newer version", stored({ version: 2, topics: { css: played } })],
    ["a missing version", JSON.stringify({ topics: { css: played } })],
    ["a stringly version", stored({ version: "1", topics: { css: played } })],
  ])("falls back to empty for %s", (_label, raw) => {
    expect(parseProgress(raw)).toEqual(createEmptyProgress())
  })

  it("round-trips a serialized snapshot", () => {
    const progress: ProgressSnapshot = {
      ...createEmptyProgress(),
      topics: { ...createEmptyProgress().topics, css: played },
      streakDays: 4,
    }
    expect(parseProgress(serializeProgress(progress))).toEqual(progress)
  })

  it("resets only the topic entries that are malformed", () => {
    const progress = parseProgress(
      stored({
        streakDays: 3,
        topics: {
          css: played,
          html: { ...played, attempts: -1 },
          js: { ...played, bestScore: 11 },
          ts: "nope",
        },
      })
    )
    expect(progress.topics.css).toEqual(played)
    expect(progress.topics.html).toEqual(createEmptyProgress().topics.html)
    expect(progress.topics.js).toEqual(createEmptyProgress().topics.js)
    expect(progress.topics.ts).toEqual(createEmptyProgress().topics.ts)
    expect(progress.streakDays).toBe(3)
  })

  it.each([
    ["fractional attempts", { ...played, attempts: 1.5 }],
    ["string attempts", { ...played, attempts: "3" }],
    ["a fractional score", { ...played, bestScore: 7.5 }],
    ["a negative score", { ...played, bestScore: -1 }],
    ["an unparseable date", { ...played, lastPlayedAt: "yesterday" }],
    ["a missing date", { ...played, lastPlayedAt: null }],
    ["zero attempts", { ...played, attempts: 0 }],
  ])("treats a topic with %s as never played", (_label, entry) => {
    const progress = parseProgress(stored({ topics: { css: entry } }))
    expect(progress.topics.css).toEqual(createEmptyProgress().topics.css)
  })

  it.each([-2, 1.5, "4", null])("defaults a streak of %s to zero", (streakDays) => {
    expect(parseProgress(stored({ streakDays })).streakDays).toBe(0)
  })

  it("ignores topics it doesn't know", () => {
    const progress = parseProgress(stored({ topics: { rust: played } }))
    expect(Object.keys(progress.topics)).toEqual(["css", "html", "js", "ts"])
  })
})

describe("lastScore", () => {
  it("reads progress saved before lastScore existed", () => {
    const legacy = {
      bestScore: 8,
      attempts: 3,
      lastPlayedAt: day(12).toISOString(),
    }
    const progress = parseProgress(stored({ topics: { css: legacy } }))
    expect(progress.topics.css).toEqual({ ...legacy, lastScore: null })
  })

  it.each([11, -1, 2.5, "7"])(
    "drops an invalid lastScore of %s but keeps the topic",
    (lastScore) => {
      const progress = parseProgress(
        stored({ topics: { css: { ...played, lastScore } } })
      )
      expect(progress.topics.css).toEqual({ ...played, lastScore: null })
    }
  )

  it("tracks the most recent score, not the best", () => {
    let progress = recordAttempt(createEmptyProgress(), {
      topicId: "html",
      score: 9,
      completedAt: day(13),
    })
    progress = recordAttempt(progress, {
      topicId: "html",
      score: 4,
      completedAt: day(14),
    })
    expect(progress.topics.html.bestScore).toBe(9)
    expect(progress.topics.html.lastScore).toBe(4)
  })
})

describe("recordAttempt", () => {
  it("records a first attempt without mutating the input", () => {
    const empty = createEmptyProgress()
    const next = recordAttempt(empty, {
      topicId: "js",
      score: 7,
      completedAt: day(14),
    })

    expect(next.topics.js).toEqual({
      bestScore: 7,
      attempts: 1,
      lastScore: 7,
      lastPlayedAt: day(14).toISOString(),
    })
    expect(next.streakDays).toBe(1)
    expect(empty).toEqual(createEmptyProgress())
  })

  it("keeps the best score across attempts", () => {
    const first = recordAttempt(createEmptyProgress(), {
      topicId: "css",
      score: 8,
      completedAt: day(14, 9),
    })
    const second = recordAttempt(first, {
      topicId: "css",
      score: 5,
      completedAt: day(14, 11),
    })

    expect(second.topics.css).toEqual({
      bestScore: 8,
      attempts: 2,
      lastScore: 5,
      lastPlayedAt: day(14, 11).toISOString(),
    })
  })

  it("records a zero score as an attempt", () => {
    const next = recordAttempt(createEmptyProgress(), {
      topicId: "ts",
      score: 0,
      completedAt: day(14),
    })
    expect(next.topics.ts.attempts).toBe(1)
    expect(next.topics.ts.bestScore).toBe(0)
  })

  it.each([-1, 11, 2.5, Number.NaN])("rejects a score of %s", (score) => {
    expect(() =>
      recordAttempt(createEmptyProgress(), {
        topicId: "css",
        score,
        completedAt: day(14),
      })
    ).toThrow(RangeError)
  })
})

describe("streaks", () => {
  const playOn = (progress: ProgressSnapshot, date: Date, topicId = "js" as const) =>
    recordAttempt(progress, { topicId, score: 6, completedAt: date })

  it("doesn't grow when playing again the same day", () => {
    const progress = playOn(playOn(createEmptyProgress(), day(14, 9)), day(14, 22))
    expect(progress.streakDays).toBe(1)
  })

  it("grows by one on consecutive days, across any topic", () => {
    let progress = playOn(createEmptyProgress(), day(12, 23))
    progress = recordAttempt(progress, {
      topicId: "css",
      score: 9,
      completedAt: day(13, 0),
    })
    progress = playOn(progress, day(14))
    expect(progress.streakDays).toBe(3)
  })

  it("restarts after a missed day", () => {
    let progress = playOn(playOn(createEmptyProgress(), day(10)), day(11))
    progress = playOn(progress, day(13))
    expect(progress.streakDays).toBe(1)
  })

  it("reports the most recent play across topics", () => {
    let progress = playOn(createEmptyProgress(), day(12))
    progress = recordAttempt(progress, {
      topicId: "html",
      score: 9,
      completedAt: day(13),
    })
    expect(getLastPlayedAt(progress)).toEqual(day(13))
    expect(getLastPlayedAt(createEmptyProgress())).toBeNull()
  })

  it("shows the current streak only while it is still alive", () => {
    const progress = playOn(playOn(createEmptyProgress(), day(12)), day(13))

    expect(getCurrentStreak(createEmptyProgress(), day(13))).toBe(0)
    expect(getCurrentStreak(progress, day(13, 23))).toBe(2)
    expect(getCurrentStreak(progress, day(14, 8))).toBe(2)
    expect(getCurrentStreak(progress, day(15))).toBe(0)
  })
})
