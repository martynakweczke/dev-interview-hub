import { describe, expect, it } from "vitest"

import type { TopicProgress } from "@/features/progress/services/progress/progress"
import {
  getImprovement,
  getNextTopicId,
  getResultsCopy,
  isNewPersonalBest,
} from "@/features/quiz/services/results/results"

const untouched: TopicProgress = {
  bestScore: 0,
  attempts: 0,
  lastScore: null,
  lastPlayedAt: null,
}

function played(bestScore: number, lastScore: number): TopicProgress {
  return {
    bestScore,
    attempts: 2,
    lastScore,
    lastPlayedAt: new Date(2026, 8, 14).toISOString(),
  }
}

describe("isNewPersonalBest", () => {
  it("is true only when the score beats the stored best", () => {
    expect(isNewPersonalBest(8, played(7, 5))).toBe(true)
    expect(isNewPersonalBest(7, played(7, 5))).toBe(false)
    expect(isNewPersonalBest(6, played(7, 5))).toBe(false)
  })

  it("counts any non-zero first round as a best, but not a first 0/10", () => {
    expect(isNewPersonalBest(1, untouched)).toBe(true)
    expect(isNewPersonalBest(0, untouched)).toBe(false)
  })
})

describe("getImprovement", () => {
  it("returns the positive gain over the last round", () => {
    expect(getImprovement(7, played(9, 5))).toBe(2)
  })

  it("hides zero and negative deltas", () => {
    expect(getImprovement(5, played(9, 5))).toBeNull()
    expect(getImprovement(3, played(9, 5))).toBeNull()
  })

  it("hides the delta when there is no previous round", () => {
    expect(getImprovement(10, untouched)).toBeNull()
  })
})

describe("getResultsCopy", () => {
  it.each([
    [10, "Outstanding round — this topic is locked in.", "A perfect score. Retry any time to keep it sharp."],
    [9, "Outstanding round — this topic is locked in.", "Nearly perfect. Retry any time to keep it sharp."],
    [8, "Strong round — you're interview-ready on the basics.", "2 to review. Retry to lock them in."],
    [7, "Strong round — you're interview-ready on the basics.", "3 to review. Retry to lock them in."],
    [6, "Solid effort — a few real gaps here.", "4 questions to review before your next attempt."],
    [4, "Solid effort — a few real gaps here.", "6 questions to review before your next attempt."],
    [3, "Good start — let's review the fundamentals.", "7 questions to review. Another round will help it stick."],
    [0, "Good start — let's review the fundamentals.", "10 questions to review. Another round will help it stick."],
  ])("picks the tier for %i/10", (score, headline, sub) => {
    expect(getResultsCopy(score, 10)).toEqual({ headline, sub })
  })
})

describe("getNextTopicId", () => {
  it("follows css → html → js → ts and wraps", () => {
    expect(getNextTopicId("css")).toBe("html")
    expect(getNextTopicId("html")).toBe("js")
    expect(getNextTopicId("js")).toBe("ts")
    expect(getNextTopicId("ts")).toBe("css")
  })
})
