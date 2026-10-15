"use server";

import { updateTag } from "next/cache";

import {
  emptyDraft,
  readQuestionDraft,
  type QuestionFormState,
} from "@/features/admin/services/question-form-state/question-form-state";
import { requireAdmin } from "@/features/auth/services/require-admin/require-admin";
import { insertQuestion, QUESTIONS_CACHE_TAG } from "@/lib/db/questions";
import { parseQuestion } from "@/lib/questions/validate-question/validate-question";

export async function createQuestion(
  previous: QuestionFormState,
  formData: FormData
): Promise<QuestionFormState> {
  await requireAdmin();

  const draft = readQuestionDraft(formData);
  const result = parseQuestion(draft);
  const submission = previous.submission + 1;

  if (!result.ok) {
    return {
      status: "invalid",
      errors: result.errors,
      values: draft,
      submission,
    };
  }

  await insertQuestion(result.question);
  updateTag(QUESTIONS_CACHE_TAG);

  return {
    status: "saved",
    errors: {},
    values: emptyDraft(result.question.topicId),
    submission,
  };
}
