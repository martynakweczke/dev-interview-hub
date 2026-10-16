import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionForm } from "@/features/admin/components/question-form/question-form";
import { createQuestion } from "@/features/admin/services/create-question/create-question";
import {
  emptyDraft,
  readQuestionDraft,
  type QuestionFormState,
} from "@/features/admin/services/question-form-state/question-form-state";

vi.mock("@/features/admin/services/create-question/create-question", () => ({
  createQuestion: vi.fn(),
}));

const action = vi.mocked(createQuestion);

beforeEach(() => {
  action.mockReset();
});

async function fillValidQuestion() {
  const user = userEvent.setup();

  await user.click(screen.getByRole("radio", { name: "CSS" }));
  await user.type(
    screen.getByRole("textbox", { name: "Question" }),
    "What does `em` scale with?"
  );

  for (const [letter, text] of [
    ["A", "The root font size"],
    ["B", "The parent font size"],
    ["C", "The viewport width"],
    ["D", "Nothing"],
  ]) {
    await user.type(
      screen.getByRole("textbox", { name: `Answer ${letter}` }),
      text
    );
  }

  await user.click(screen.getByRole("radio", { name: "Answer B is correct" }));
  await user.type(
    screen.getByRole("textbox", { name: "Explanation" }),
    "`em` is relative to the parent."
  );

  return user;
}

describe("QuestionForm", () => {
  it("sends every field to the server action", async () => {
    action.mockImplementation(async (previous) => ({
      ...previous,
      status: "saved",
      values: emptyDraft("css"),
      submission: previous.submission + 1,
    }));
    render(<QuestionForm />);

    const user = await fillValidQuestion();
    await user.click(screen.getByRole("button", { name: "Add question" }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(readQuestionDraft(action.mock.calls[0][1])).toEqual({
      topicId: "css",
      prompt: "What does `em` scale with?",
      options: [
        { id: "a", label: "The root font size" },
        { id: "b", label: "The parent font size" },
        { id: "c", label: "The viewport width" },
        { id: "d", label: "Nothing" },
      ],
      correctOptionId: "b",
      explanation: "`em` is relative to the parent.",
    });
  });

  it("clears the form after saving but keeps the topic", async () => {
    action.mockImplementation(async (previous) => ({
      ...previous,
      status: "saved",
      values: emptyDraft("css"),
      submission: previous.submission + 1,
    }));
    render(<QuestionForm />);

    const user = await fillValidQuestion();
    await user.click(screen.getByRole("button", { name: "Add question" }));

    expect(
      await screen.findByText("Question added to CSS.")
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Question" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Question" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "CSS" })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Answer B is correct" })
    ).not.toBeChecked();
  });

  it("shows errors next to their fields and keeps what was typed", async () => {
    action.mockImplementation(
      async (previous, formData): Promise<QuestionFormState> => ({
        status: "invalid",
        errors: {
          prompt: "Question is required.",
          "options.c": "Answer C is required.",
        },
        values: readQuestionDraft(formData),
        submission: previous.submission + 1,
      })
    );
    render(<QuestionForm />);

    const user = userEvent.setup();
    await user.type(
      screen.getByRole("textbox", { name: "Answer A" }),
      "Kept answer"
    );
    await user.click(screen.getByRole("button", { name: "Add question" }));

    expect(
      await screen.findByText("Fix the highlighted fields and try again.")
    ).toBeInTheDocument();

    const prompt = screen.getByRole("textbox", { name: "Question" });

    expect(prompt).toHaveAttribute("aria-invalid", "true");
    expect(prompt).toHaveAccessibleDescription(
      "Wrap code in backticks: `like this`. Question is required."
    );
    expect(prompt).toHaveFocus();
    expect(
      screen.getByRole("textbox", { name: "Answer C" })
    ).toHaveAccessibleDescription("Answer C is required.");
    expect(screen.getByRole("textbox", { name: "Answer A" })).toHaveValue(
      "Kept answer"
    );
  });

  it("moves focus to the topic picker when only the topic is missing", async () => {
    action.mockImplementation(
      async (previous, formData): Promise<QuestionFormState> => ({
        status: "invalid",
        errors: { topicId: "Pick one of the topics." },
        values: readQuestionDraft(formData),
        submission: previous.submission + 1,
      })
    );
    render(<QuestionForm />);

    await userEvent.click(screen.getByRole("button", { name: "Add question" }));

    expect(await screen.findByText("Pick one of the topics.")).toBeVisible();
    expect(screen.getByRole("radio", { name: "CSS" })).toHaveFocus();
  });
});
