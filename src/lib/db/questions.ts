import "server-only";

import { asc, eq, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db/db";
import { questions } from "@/lib/db/schema";
import { QUESTIONS_PER_ROUND } from "@/lib/questions/types";
import type { Option, Question, TopicId } from "@/lib/questions/types";
import type { QuestionInput } from "@/lib/questions/validate-question/validate-question";

export const QUESTIONS_CACHE_TAG = "questions";

type QuestionRow = typeof questions.$inferSelect;

function toOptions(id: string, value: readonly Option[]): Question["options"] {
  if (value.length !== 4) {
    throw new Error(
      `Question "${id}" has ${value.length} options, expected exactly 4`
    );
  }

  return value as unknown as Question["options"];
}

function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    topicId: row.topicId,
    prompt: row.prompt,
    options: toOptions(row.id, row.options),
    correctOptionId: row.correctOptionId,
    ...(row.explanation === null ? {} : { explanation: row.explanation }),
  };
}

export async function getQuestionsForTopic(
  topicId: TopicId
): Promise<readonly Question[]> {
  "use cache";
  cacheLife("max");
  cacheTag(QUESTIONS_CACHE_TAG);

  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.position))
    .limit(QUESTIONS_PER_ROUND);

  return rows.map(toQuestion);
}

export async function getAllQuestions(): Promise<readonly Question[]> {
  "use cache";
  cacheLife("max");
  cacheTag(QUESTIONS_CACHE_TAG);

  const rows = await db
    .select()
    .from(questions)
    .orderBy(asc(questions.topicId), asc(questions.position));

  return rows.map(toQuestion);
}

export async function insertQuestion(input: QuestionInput): Promise<string> {
  const [{ lastPosition }] = await db
    .select({ lastPosition: max(questions.position) })
    .from(questions)
    .where(eq(questions.topicId, input.topicId));

  const id = `${input.topicId}-${crypto.randomUUID().slice(0, 8)}`;

  await db.insert(questions).values({
    id,
    topicId: input.topicId,
    position: (lastPosition ?? -1) + 1,
    prompt: input.prompt,
    options: input.options,
    correctOptionId: input.correctOptionId,
    explanation: input.explanation ?? null,
  });

  return id;
}
