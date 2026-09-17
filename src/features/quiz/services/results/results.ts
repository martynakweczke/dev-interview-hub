import type { TopicProgress } from "@/features/progress/services/progress/progress"
import { TOPIC_IDS, type TopicId } from "@/lib/questions/types"

export type ResultsCopy = {
  headline: string
  sub: string
}

export function isNewPersonalBest(
  score: number,
  previous: TopicProgress
): boolean {
  return score > previous.bestScore
}

export function getImprovement(
  score: number,
  previous: TopicProgress
): number | null {
  if (previous.lastScore === null) return null
  const delta = score - previous.lastScore
  return delta > 0 ? delta : null
}

export function getResultsCopy(score: number, total: number): ResultsCopy {
  const missed = total - score
  const ratio = score / total

  if (missed === 0) {
    return {
      headline: "Outstanding round — this topic is locked in.",
      sub: "A perfect score. Retry any time to keep it sharp.",
    }
  }
  if (ratio >= 0.9) {
    return {
      headline: "Outstanding round — this topic is locked in.",
      sub: "Nearly perfect. Retry any time to keep it sharp.",
    }
  }
  if (ratio >= 0.7) {
    return {
      headline: "Strong round — you're interview-ready on the basics.",
      sub: `${missed} to review. Retry to lock them in.`,
    }
  }
  if (ratio >= 0.4) {
    return {
      headline: "Solid effort — a few real gaps here.",
      sub: `${missed} questions to review before your next attempt.`,
    }
  }
  return {
    headline: "Good start — let's review the fundamentals.",
    sub: `${missed} questions to review. Another round will help it stick.`,
  }
}

export function getNextTopicId(topicId: TopicId): TopicId {
  return TOPIC_IDS[(TOPIC_IDS.indexOf(topicId) + 1) % TOPIC_IDS.length]
}
