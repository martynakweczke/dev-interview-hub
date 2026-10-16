import { OPTION_IDS } from "@/lib/questions/types";
import type {
  QuestionDraft,
  QuestionErrors,
} from "@/lib/questions/validate-question/validate-question";

export type QuestionFormState = {
  status: "idle" | "invalid" | "saved";
  errors: QuestionErrors;
  values: QuestionDraft;
  submission: number;
};

export function optionFieldName(id: string): string {
  return `option-${id}`;
}

export function emptyDraft(topicId = ""): QuestionDraft {
  return {
    topicId,
    prompt: "",
    options: OPTION_IDS.map((id) => ({ id, label: "" })),
    correctOptionId: "",
    explanation: "",
  };
}

export const initialQuestionFormState: QuestionFormState = {
  status: "idle",
  errors: {},
  values: emptyDraft(),
  submission: 0,
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

export function readQuestionDraft(formData: FormData): QuestionDraft {
  return {
    topicId: readText(formData, "topicId"),
    prompt: readText(formData, "prompt"),
    options: OPTION_IDS.map((id) => ({
      id,
      label: readText(formData, optionFieldName(id)),
    })),
    correctOptionId: readText(formData, "correctOptionId"),
    explanation: readText(formData, "explanation"),
  };
}
