import { hasWellFormedInlineCode } from "@/lib/inline-code/inline-code";
import { isTopicId } from "@/lib/questions/topics";
import {
  OPTION_IDS,
  type OptionId,
  type Question,
  type TopicId,
} from "@/lib/questions/types";

export type QuestionDraft = {
  topicId: string;
  prompt: string;
  options: readonly { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
};

export type QuestionErrorKey =
  | "topicId"
  | "prompt"
  | "options"
  | `options.${OptionId}`
  | "correctOptionId"
  | "explanation";

export type QuestionErrors = Partial<Record<QuestionErrorKey, string>>;

export type QuestionInput = Omit<Question, "id">;

export type QuestionParseResult =
  { ok: true; question: QuestionInput } | { ok: false; errors: QuestionErrors };

function textError(text: string, label: string): string | undefined {
  if (text.trim() === "") {
    return `${label} is required.`;
  }

  if (!hasWellFormedInlineCode(text)) {
    return `${label} has an unclosed or empty \`code\` span.`;
  }

  return undefined;
}

function isOptionId(value: string): value is OptionId {
  return (OPTION_IDS as readonly string[]).includes(value);
}

export function validateQuestion(draft: QuestionDraft): QuestionErrors {
  const errors: QuestionErrors = {};

  if (!isTopicId(draft.topicId)) {
    errors.topicId = "Pick one of the topics.";
  }

  const promptError = textError(draft.prompt, "Question");

  if (promptError) {
    errors.prompt = promptError;
  }

  const optionIds = draft.options.map((option) => option.id);

  if (optionIds.join() !== OPTION_IDS.join()) {
    errors.options = `Answers must be ${OPTION_IDS.join(", ")}, in that order.`;
  } else {
    for (const option of draft.options) {
      const optionError = textError(
        option.label,
        `Answer ${option.id.toUpperCase()}`
      );

      if (optionError && isOptionId(option.id)) {
        errors[`options.${option.id}`] = optionError;
      }
    }

    const labels = draft.options
      .map((option) => option.label.trim())
      .filter((label) => label !== "");

    if (new Set(labels).size !== labels.length) {
      errors.options = "Every answer must be different.";
    }
  }

  if (!isOptionId(draft.correctOptionId)) {
    errors.correctOptionId = "Mark the correct answer.";
  }

  const explanationError = textError(draft.explanation, "Explanation");

  if (explanationError) {
    errors.explanation = explanationError;
  } else if (/\n/.test(draft.explanation)) {
    errors.explanation = "Explanation must fit on one line.";
  }

  return errors;
}

export function parseQuestion(draft: QuestionDraft): QuestionParseResult {
  const errors = validateQuestion(draft);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    question: {
      topicId: draft.topicId as TopicId,
      prompt: draft.prompt.trim(),
      options: draft.options.map((option) => ({
        id: option.id as OptionId,
        label: option.label.trim(),
      })) as unknown as Question["options"],
      correctOptionId: draft.correctOptionId as OptionId,
      explanation: draft.explanation.trim(),
    },
  };
}
