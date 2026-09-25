import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { questions } from "@/lib/db/schema";
import { QUESTIONS_PER_ROUND } from "@/lib/questions/types";
import type { Option, Question, TopicId } from "@/lib/questions/types";

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
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.position))
    .limit(QUESTIONS_PER_ROUND);

  return rows.map(toQuestion);
}
