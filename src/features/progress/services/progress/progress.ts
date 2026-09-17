import {
  QUESTIONS_PER_ROUND,
  TOPIC_IDS,
  type TopicId,
} from "@/lib/questions/types"
import { calendarDaysBetween, isDateString } from "@/utils/date/date.utils"

export const PROGRESS_STORAGE_KEY = "progress"

export const PROGRESS_SCHEMA_VERSION = 1

export type TopicProgress = {
  bestScore: number
  attempts: number
  lastScore: number | null
  lastPlayedAt: string | null
}

export type ProgressSnapshot = {
  version: typeof PROGRESS_SCHEMA_VERSION
  topics: Record<TopicId, TopicProgress>
  streakDays: number
}

export type Attempt = {
  topicId: TopicId
  score: number
  completedAt: Date
}

function mapTopics<T>(fn: (id: TopicId) => T): Record<TopicId, T> {
  return Object.fromEntries(TOPIC_IDS.map((id) => [id, fn(id)])) as Record<
    TopicId,
    T
  >
}

function createEmptyTopicProgress(): TopicProgress {
  return { bestScore: 0, attempts: 0, lastScore: null, lastPlayedAt: null }
}

export function createEmptyProgress(): ProgressSnapshot {
  return {
    version: PROGRESS_SCHEMA_VERSION,
    topics: mapTopics(createEmptyTopicProgress),
    streakDays: 0,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}

export function isValidScore(value: unknown): value is number {
  return isCount(value) && value <= QUESTIONS_PER_ROUND
}

function parseTopicProgress(value: unknown): TopicProgress {
  if (!isRecord(value)) return createEmptyTopicProgress()

  const { bestScore, attempts, lastScore, lastPlayedAt } = value
  if (
    !isCount(attempts) ||
    attempts === 0 ||
    !isValidScore(bestScore) ||
    !isDateString(lastPlayedAt)
  ) {
    return createEmptyTopicProgress()
  }

  return {
    bestScore,
    attempts,
    lastScore: isValidScore(lastScore) ? lastScore : null,
    lastPlayedAt,
  }
}

export function parseProgress(raw: string | null): ProgressSnapshot {
  if (raw === null) return createEmptyProgress()

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return createEmptyProgress()
  }

  if (!isRecord(data) || data.version !== PROGRESS_SCHEMA_VERSION) {
    return createEmptyProgress()
  }

  const topics = isRecord(data.topics) ? data.topics : {}
  const { streakDays } = data

  return {
    version: PROGRESS_SCHEMA_VERSION,
    topics: mapTopics((id) => parseTopicProgress(topics[id])),
    streakDays: isCount(streakDays) ? streakDays : 0,
  }
}

export function serializeProgress(progress: ProgressSnapshot): string {
  return JSON.stringify(progress)
}

export function getLastPlayedAt(progress: ProgressSnapshot): Date | null {
  const times = TOPIC_IDS.flatMap((id) => {
    const { lastPlayedAt } = progress.topics[id]
    return lastPlayedAt === null ? [] : [Date.parse(lastPlayedAt)]
  })
  return times.length === 0 ? null : new Date(Math.max(...times))
}

export function getCurrentStreak(progress: ProgressSnapshot, now: Date): number {
  const lastPlayedAt = getLastPlayedAt(progress)
  if (lastPlayedAt === null) return 0
  return calendarDaysBetween(lastPlayedAt, now) <= 1 ? progress.streakDays : 0
}

function nextStreak(progress: ProgressSnapshot, completedAt: Date): number {
  const lastPlayedAt = getLastPlayedAt(progress)
  if (lastPlayedAt === null) return 1

  const days = calendarDaysBetween(lastPlayedAt, completedAt)
  if (days <= 0) return Math.max(progress.streakDays, 1)
  return days === 1 ? progress.streakDays + 1 : 1
}

export function recordAttempt(
  progress: ProgressSnapshot,
  { topicId, score, completedAt }: Attempt
): ProgressSnapshot {
  if (!isValidScore(score)) {
    throw new RangeError(
      `Score must be an integer from 0 to ${QUESTIONS_PER_ROUND}, got ${score}`
    )
  }

  const previous = progress.topics[topicId]

  return {
    version: PROGRESS_SCHEMA_VERSION,
    topics: {
      ...progress.topics,
      [topicId]: {
        bestScore: Math.max(previous.bestScore, score),
        attempts: previous.attempts + 1,
        lastScore: score,
        lastPlayedAt: completedAt.toISOString(),
      },
    },
    streakDays: nextStreak(progress, completedAt),
  }
}
