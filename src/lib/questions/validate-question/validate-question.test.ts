import { describe, expect, it } from "vitest";

import {
  validateQuestion,
  type QuestionDraft,
} from "@/lib/questions/validate-question/validate-question";

const valid: QuestionDraft = {
  topicId: "js",
  prompt: "What does `typeof null` evaluate to?",
  options: [
    { id: "a", label: '`"null"`' },
    { id: "b", label: '`"object"`' },
    { id: "c", label: '`"undefined"`' },
    { id: "d", label: "It throws" },
  ],
  correctOptionId: "b",
  explanation: "A legacy quirk: `null` reports as an object.",
};

function withOption(id: string, label: string): QuestionDraft {
  return {
    ...valid,
    options: valid.options.map((option) =>
      option.id === id ? { ...option, label } : option
    ),
  };
}

describe("validateQuestion", () => {
  it("accepts a complete question", () => {
    expect(validateQuestion(valid)).toEqual({});
  });

  it("rejects an unknown topic", () => {
    expect(validateQuestion({ ...valid, topicId: "python" })).toEqual({
      topicId: "Pick one of the topics.",
    });
  });

  it("requires a prompt", () => {
    expect(validateQuestion({ ...valid, prompt: "   " })).toEqual({
      prompt: "Question is required.",
    });
  });

  it("rejects a broken code span", () => {
    expect(validateQuestion({ ...valid, prompt: "What is `this?" })).toEqual({
      prompt: "Question has an unclosed or empty `code` span.",
    });
  });

  it("reports each empty answer on its own key", () => {
    expect(validateQuestion(withOption("c", ""))).toEqual({
      "options.c": "Answer C is required.",
    });
  });

  it("rejects duplicate answers, ignoring surrounding spaces", () => {
    expect(validateQuestion(withOption("d", ' `"object"` '))).toEqual({
      options: "Every answer must be different.",
    });
  });

  it("does not count two empty answers as duplicates", () => {
    const draft = {
      ...valid,
      options: valid.options.map((option) =>
        option.id === "c" || option.id === "d"
          ? { ...option, label: "" }
          : option
      ),
    };

    expect(validateQuestion(draft)).toEqual({
      "options.c": "Answer C is required.",
      "options.d": "Answer D is required.",
    });
  });

  it("requires answers a to d, in order", () => {
    expect(
      validateQuestion({ ...valid, options: valid.options.slice(0, 3) })
    ).toEqual({ options: "Answers must be a, b, c, d, in that order." });
    expect(
      validateQuestion({ ...valid, options: [...valid.options].reverse() })
    ).toEqual({ options: "Answers must be a, b, c, d, in that order." });
  });

  it("requires a correct answer", () => {
    expect(validateQuestion({ ...valid, correctOptionId: "" })).toEqual({
      correctOptionId: "Mark the correct answer.",
    });
    expect(validateQuestion({ ...valid, correctOptionId: "e" })).toEqual({
      correctOptionId: "Mark the correct answer.",
    });
  });

  it("requires a one-line explanation", () => {
    expect(validateQuestion({ ...valid, explanation: "" })).toEqual({
      explanation: "Explanation is required.",
    });
    expect(
      validateQuestion({ ...valid, explanation: "First line\nsecond line" })
    ).toEqual({ explanation: "Explanation must fit on one line." });
  });

  it("collects every error at once", () => {
    expect(
      Object.keys(
        validateQuestion({
          topicId: "",
          prompt: "",
          options: [],
          correctOptionId: "",
          explanation: "",
        })
      )
    ).toEqual([
      "topicId",
      "prompt",
      "options",
      "correctOptionId",
      "explanation",
    ]);
  });
});
