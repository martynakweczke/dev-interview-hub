import { cssQuestions } from "@/lib/questions/css"
import { htmlQuestions } from "@/lib/questions/html"
import { jsQuestions } from "@/lib/questions/js"
import { topicsById } from "@/lib/questions/topics"
import { tsQuestions } from "@/lib/questions/ts"
import {
  TOPIC_IDS,
  type Question,
  type Topic,
  type TopicId,
} from "@/lib/questions/types"

export * from "@/lib/questions/types"

const questionsByTopic: Record<TopicId, readonly Question[]> = {
  css: cssQuestions,
  html: htmlQuestions,
  js: jsQuestions,
  ts: tsQuestions,
}

export const topics: readonly Topic[] = TOPIC_IDS.map((id) => topicsById[id])

export const questions: readonly Question[] = TOPIC_IDS.flatMap(
  (id) => questionsByTopic[id]
)

export function isTopicId(value: unknown): value is TopicId {
  return (TOPIC_IDS as readonly unknown[]).includes(value)
}

export function getTopic(id: TopicId): Topic {
  return topicsById[id]
}

export function getQuestionsForTopic(id: TopicId): readonly Question[] {
  return questionsByTopic[id]
}
