import { describe, expect, it } from "vitest";

import { getSeedQuestionsForTopic, type OptionId } from "@/lib/questions";
import {
  createQuizState,
  getCurrentQuestion,
  getQuizResult,
  quizReducer,
  type QuizAction,
  type QuizState,
} from "@/features/quiz/services/quiz/quiz";

const questions = getSeedQuestionsForTopic("js");

function start(): QuizState {
  return createQuizState("js", questions);
}

function run(state: QuizState, actions: QuizAction[]): QuizState {
  return actions.reduce(quizReducer, state);
}

function play(picks: (OptionId | null)[]): QuizState {
  return run(
    start(),
    picks.flatMap((pick): QuizAction[] =>
      pick === null
        ? [{ type: "skip" }]
        : [{ type: "select", optionId: pick }, { type: "advance" }]
    )
  );
}

const allCorrect = questions.map((question) => question.correctOptionId);

function wrong(optionId: OptionId): OptionId {
  return optionId === "a" ? "b" : "a";
}

describe("createQuizState", () => {
  it("starts on the first question with nothing answered", () => {
    expect(start()).toEqual({
      topicId: "js",
      questions,
      index: 0,
      answers: {},
      selection: null,
      result: null,
    });
    expect(getCurrentQuestion(start())).toBe(questions[0]);
  });

  it("rejects a round without questions", () => {
    expect(() => createQuizState("js", [])).toThrow(RangeError);
  });
});

describe("select", () => {
  it("sets the selection without recording an answer", () => {
    const state = quizReducer(start(), { type: "select", optionId: "b" });

    expect(state.selection).toBe("b");
    expect(state.answers).toEqual({});
    expect(state.index).toBe(0);
  });

  it("replaces an earlier selection", () => {
    const state = run(start(), [
      { type: "select", optionId: "b" },
      { type: "select", optionId: "d" },
    ]);
    expect(state.selection).toBe("d");
  });

  it("returns the same state when re-selecting the current option", () => {
    const selected = quizReducer(start(), { type: "select", optionId: "c" });
    expect(quizReducer(selected, { type: "select", optionId: "c" })).toBe(
      selected
    );
  });
});

describe("advance", () => {
  it("does nothing without a selection", () => {
    const state = start();
    expect(quizReducer(state, { type: "advance" })).toBe(state);
  });

  it("records the selection, clears it and moves to the next question", () => {
    const state = run(start(), [
      { type: "select", optionId: "b" },
      { type: "advance" },
    ]);

    expect(state.answers).toEqual({ [questions[0].id]: "b" });
    expect(state.selection).toBeNull();
    expect(state.index).toBe(1);
    expect(state.result).toBeNull();
  });
});

describe("skip", () => {
  it("records no answer and moves to the next question", () => {
    const state = quizReducer(start(), { type: "skip" });

    expect(state.answers).toEqual({ [questions[0].id]: null });
    expect(state.index).toBe(1);
    expect(state.result).toBeNull();
  });

  it("discards a pending selection", () => {
    const state = run(start(), [
      { type: "select", optionId: "a" },
      { type: "skip" },
    ]);

    expect(state.answers[questions[0].id]).toBeNull();
    expect(state.selection).toBeNull();
  });
});

describe("finishing a round", () => {
  it("computes the result after the last question and stays on it", () => {
    const picks = allCorrect.map((id, index) =>
      index === 3 || index === 7 ? wrong(id) : index === 9 ? null : id
    );
    const state = play(picks);

    expect(state.index).toBe(questions.length - 1);
    expect(state.selection).toBeNull();
    expect(state.result).toEqual({
      topicId: "js",
      score: 7,
      percentage: 70,
      answers: questions.map((question, index) => ({
        question,
        selectedOptionId: picks[index],
        isCorrect: picks[index] === question.correctOptionId,
      })),
    });
  });

  it("finishes on a skipped last question, marking it unanswered", () => {
    const state = play([...allCorrect.slice(0, 9), null]);
    const last = state.result?.answers.at(-1);

    expect(state.result?.score).toBe(9);
    expect(last).toMatchObject({ selectedOptionId: null, isCorrect: false });
  });

  it("ignores every action except restart once finished", () => {
    const finished = play(allCorrect);

    for (const action of [
      { type: "select", optionId: "a" },
      { type: "advance" },
      { type: "skip" },
    ] satisfies QuizAction[]) {
      expect(quizReducer(finished, action)).toBe(finished);
    }
  });

  it("restarts the same topic from the first question", () => {
    const restarted = quizReducer(play(allCorrect), { type: "restart" });
    expect(restarted).toEqual(start());
  });
});

describe("getQuizResult", () => {
  it.each([
    ["no answers", {}, 0, 0],
    [
      "all correct",
      Object.fromEntries(questions.map((q) => [q.id, q.correctOptionId])),
      10,
      100,
    ],
    [
      "all wrong",
      Object.fromEntries(
        questions.map((q) => [q.id, wrong(q.correctOptionId)])
      ),
      0,
      0,
    ],
  ] as const)("scores %s", (_, answers, score, percentage) => {
    const result = getQuizResult("js", questions, answers);

    expect(result.score).toBe(score);
    expect(result.percentage).toBe(percentage);
    expect(result.answers).toHaveLength(questions.length);
  });

  it("treats questions missing from the answers as skipped", () => {
    const result = getQuizResult("js", questions, {});
    expect(result.answers.every((row) => row.selectedOptionId === null)).toBe(
      true
    );
  });
});
