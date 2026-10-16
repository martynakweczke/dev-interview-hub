import { describe, expect, it } from "vitest";

import {
  emptyDraft,
  optionFieldName,
  readQuestionDraft,
} from "@/features/admin/services/question-form-state/question-form-state";

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();

  for (const [name, value] of Object.entries(entries)) {
    data.set(name, value);
  }

  return data;
}

describe("readQuestionDraft", () => {
  it("reads every field of the form", () => {
    expect(
      readQuestionDraft(
        formData({
          topicId: "css",
          prompt: "What does `box-sizing: border-box` change?",
          [optionFieldName("a")]: "Margins",
          [optionFieldName("b")]: "Width includes padding",
          [optionFieldName("c")]: "Nothing",
          [optionFieldName("d")]: "Display",
          correctOptionId: "b",
          explanation: "Padding and border count toward `width`.",
        })
      )
    ).toEqual({
      topicId: "css",
      prompt: "What does `box-sizing: border-box` change?",
      options: [
        { id: "a", label: "Margins" },
        { id: "b", label: "Width includes padding" },
        { id: "c", label: "Nothing" },
        { id: "d", label: "Display" },
      ],
      correctOptionId: "b",
      explanation: "Padding and border count toward `width`.",
    });
  });

  it("turns missing fields into empty strings", () => {
    expect(readQuestionDraft(new FormData())).toEqual(emptyDraft());
  });

  it("ignores file uploads posing as text", () => {
    const data = new FormData();
    data.set("prompt", new File(["x"], "prompt.txt"));

    expect(readQuestionDraft(data).prompt).toBe("");
  });
});

describe("emptyDraft", () => {
  it("keeps the chosen topic and clears the rest", () => {
    expect(emptyDraft("ts")).toEqual({
      topicId: "ts",
      prompt: "",
      options: [
        { id: "a", label: "" },
        { id: "b", label: "" },
        { id: "c", label: "" },
        { id: "d", label: "" },
      ],
      correctOptionId: "",
      explanation: "",
    });
  });
});
