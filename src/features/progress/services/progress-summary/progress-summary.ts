import {
  getCurrentStreak,
  type ProgressSnapshot,
  type TopicProgress,
} from "@/features/progress/services/progress/progress"
import {
  QUESTIONS_PER_ROUND,
  TOPIC_IDS,
  type TopicId,
} from "@/lib/questions/types"
import { calendarDaysBetween, formatDaysAgo } from "@/utils/date/date.utils"

export type TopicStatus =
  | { kind: "new" }
  | { kind: "review"; count: number }
  | { kind: "played"; daysAgo: number }

export type OverallAccuracy = {
  mastered: number
  total: number
  percent: number
  hasAttempts: boolean
}

export function getTopicStatus(progress: TopicProgress, now: Date): TopicStatus {
  if (progress.attempts === 0 || progress.lastPlayedAt === null) {
    return { kind: "new" }
  }
  if (progress.lastScore !== null && progress.lastScore < QUESTIONS_PER_ROUND) {
    return { kind: "review", count: QUESTIONS_PER_ROUND - progress.lastScore }
  }
  const daysAgo = calendarDaysBetween(new Date(progress.lastPlayedAt), now)
  return { kind: "played", daysAgo: Math.max(0, daysAgo) }
}

export function formatTopicStatus(status: TopicStatus): string {
  switch (status.kind) {
    case "new":
      return "Start your first round"
    case "review":
      return `${status.count} ${status.count === 1 ? "question" : "questions"} to review`
    case "played":
      return `Last played ${formatDaysAgo(status.daysAgo)}`
  }
}

export type TopicHistoryItem = {
  label: string
  value: string
}

export function getTopicHistory(
  progress: TopicProgress,
  now: Date
): TopicHistoryItem[] {
  const { attempts, lastScore, lastPlayedAt } = progress
  const played = attempts > 0 && lastPlayedAt !== null
  const daysAgo = played
    ? Math.max(0, calendarDaysBetween(new Date(lastPlayedAt), now))
    : null

  return [
    { label: "Rounds", value: String(played ? attempts : 0) },
    {
      label: "Last score",
      value:
        played && lastScore !== null ? `${lastScore}/${QUESTIONS_PER_ROUND}` : "—",
    },
    {
      label: "Last played",
      value: daysAgo === null ? "—" : formatDaysAgo(daysAgo),
    },
  ]
}

export function getOverallAccuracy(progress: ProgressSnapshot): OverallAccuracy {
  const total = TOPIC_IDS.length * QUESTIONS_PER_ROUND
  const mastered = TOPIC_IDS.reduce(
    (sum, id) => sum + progress.topics[id].bestScore,
    0
  )
  return {
    mastered,
    total,
    percent: Math.floor((mastered / total) * 100),
    hasAttempts: TOPIC_IDS.some((id) => progress.topics[id].attempts > 0),
  }
}

export function formatAccuracyCaption(accuracy: OverallAccuracy): string {
  return accuracy.hasAttempts
    ? `${accuracy.mastered} of ${accuracy.total} questions mastered`
    : "Play your first round to get started"
}

export function formatStreak(progress: ProgressSnapshot, now: Date): string | null {
  const days = getCurrentStreak(progress, now)
  return days === 0 ? null : `${days}-day streak`
}

export function sortTopicsByWeakest<T extends { id: TopicId }>(
  topics: readonly T[],
  progress: ProgressSnapshot
): T[] {
  return [...topics].sort(
    (a, b) =>
      progress.topics[a.id].bestScore - progress.topics[b.id].bestScore ||
      TOPIC_IDS.indexOf(a.id) - TOPIC_IDS.indexOf(b.id)
  )
}

export function getFocusTopicId(progress: ProgressSnapshot): TopicId | null {
  let weakest: TopicId | null = null
  for (const id of TOPIC_IDS) {
    const topic = progress.topics[id]
    if (topic.attempts === 0) continue
    if (weakest === null || topic.bestScore < progress.topics[weakest].bestScore) {
      weakest = id
    }
  }
  return weakest
}

export function getResumeTopicId(progress: ProgressSnapshot): TopicId | null {
  let latest: { id: TopicId; time: number } | null = null
  for (const id of TOPIC_IDS) {
    const { attempts, lastPlayedAt } = progress.topics[id]
    if (attempts === 0 || lastPlayedAt === null) continue
    const time = Date.parse(lastPlayedAt)
    if (latest === null || time > latest.time) latest = { id, time }
  }
  return latest?.id ?? null
}
