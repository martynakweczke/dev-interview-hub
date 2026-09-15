import { describe, expect, it } from "vitest"

import {
  createEmptyProgress,
  type ProgressSnapshot,
  type TopicProgress,
} from "@/lib/progress"
import {
  formatAccuracyCaption,
  formatStreak,
  formatTopicStatus,
  getFocusTopicId,
  getOverallAccuracy,
  getResumeTopicId,
  getTopicStatus,
  sortTopicsByWeakest,
} from "@/lib/progress-summary"
import { topics, type TopicId } from "@/lib/questions"

const day = (date: number, hour = 10) => new Date(2026, 8, date, hour)
const today = day(14, 12)

function played(
  bestScore: number,
  lastScore: number | null,
  playedOn: Date
): TopicProgress {
  return {
    bestScore,
    attempts: 2,
    lastScore,
    lastPlayedAt: playedOn.toISOString(),
  }
}

function progressWith(
  entries: Partial<Record<TopicId, TopicProgress>>,
  streakDays = 0
): ProgressSnapshot {
  const empty = createEmptyProgress()
  return { ...empty, topics: { ...empty.topics, ...entries }, streakDays }
}

const example = progressWith(
  {
    css: played(10, 10, day(12)),
    html: played(9, 9, day(9)),
    js: played(7, 7, day(13)),
  },
  4
)

describe("getTopicStatus", () => {
  it("invites a first round when never played", () => {
    expect(getTopicStatus(createEmptyProgress().topics.ts, today)).toEqual({
      kind: "new",
    })
  })

  it("counts the wrong answers from the last round", () => {
    expect(getTopicStatus(played(9, 7, day(13)), today)).toEqual({
      kind: "review",
      count: 3,
    })
  })

  it("uses the last round, not the best one", () => {
    expect(getTopicStatus(played(10, 9, day(13)), today)).toEqual({
      kind: "review",
      count: 1,
    })
  })

  it("reports when a perfect last round was played", () => {
    expect(getTopicStatus(played(10, 10, day(12, 23)), today)).toEqual({
      kind: "played",
      daysAgo: 2,
    })
  })

  it("falls back to last played when the last score is unknown", () => {
    expect(getTopicStatus(played(6, null, day(14, 8)), today)).toEqual({
      kind: "played",
      daysAgo: 0,
    })
  })
})

describe("formatTopicStatus", () => {
  it.each([
    [{ kind: "new" } as const, "Start your first round"],
    [{ kind: "review", count: 3 } as const, "3 questions to review"],
    [{ kind: "review", count: 1 } as const, "1 question to review"],
    [{ kind: "played", daysAgo: 0 } as const, "Last played today"],
    [{ kind: "played", daysAgo: 1 } as const, "Last played yesterday"],
    [{ kind: "played", daysAgo: 5 } as const, "Last played 5 days ago"],
  ])("formats %o as %s", (status, label) => {
    expect(formatTopicStatus(status)).toBe(label)
  })
})

describe("getOverallAccuracy", () => {
  it("is zero with nothing to show yet", () => {
    const accuracy = getOverallAccuracy(createEmptyProgress())
    expect(accuracy).toEqual({
      mastered: 0,
      total: 40,
      percent: 0,
      hasAttempts: false,
    })
    expect(formatAccuracyCaption(accuracy)).toBe(
      "Play your first round to get started"
    )
  })

  it("sums best scores across all topics", () => {
    const accuracy = getOverallAccuracy(example)
    expect(accuracy).toEqual({
      mastered: 26,
      total: 40,
      percent: 65,
      hasAttempts: true,
    })
    expect(formatAccuracyCaption(accuracy)).toBe("26 of 40 questions mastered")
  })

  it("rounds the percentage down", () => {
    const progress = progressWith({
      css: played(8, 8, day(10)),
      html: played(9, 9, day(10)),
      js: played(7, 7, day(10)),
      ts: played(5, 5, day(10)),
    })
    expect(getOverallAccuracy(progress).percent).toBe(72)
  })
})

describe("formatStreak", () => {
  it("hides a streak that hasn't started", () => {
    expect(formatStreak(createEmptyProgress(), today)).toBeNull()
  })

  it("labels a live streak", () => {
    expect(formatStreak(example, today)).toBe("4-day streak")
  })

  it("hides a streak that has lapsed", () => {
    expect(formatStreak(example, day(20))).toBeNull()
  })
})

describe("sortTopicsByWeakest", () => {
  it("orders by best score, weakest first", () => {
    expect(sortTopicsByWeakest(topics, example).map((t) => t.id)).toEqual([
      "ts",
      "js",
      "html",
      "css",
    ])
  })

  it("breaks ties with the fixed topic order", () => {
    expect(
      sortTopicsByWeakest(topics, createEmptyProgress()).map((t) => t.id)
    ).toEqual(["css", "html", "js", "ts"])
  })
})

describe("getFocusTopicId", () => {
  it("picks nothing before any round is played", () => {
    expect(getFocusTopicId(createEmptyProgress())).toBeNull()
  })

  it("picks the weakest attempted topic, ignoring untouched ones", () => {
    expect(getFocusTopicId(example)).toBe("js")
  })

  it("breaks ties with the fixed topic order", () => {
    const progress = progressWith({
      ts: played(6, 6, day(13)),
      html: played(6, 6, day(12)),
    })
    expect(getFocusTopicId(progress)).toBe("html")
  })
})

describe("getResumeTopicId", () => {
  it("has nothing to resume before any round is played", () => {
    expect(getResumeTopicId(createEmptyProgress())).toBeNull()
  })

  it("resumes the most recently played topic", () => {
    expect(getResumeTopicId(example)).toBe("js")
  })
})
