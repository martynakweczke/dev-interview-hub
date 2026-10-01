import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  QuizProvider,
  useQuiz,
} from "@/features/quiz/components/quiz-provider/quiz-provider";
import { QuizView } from "@/features/quiz/components/quiz-view/quiz-view";
import { ResultsView } from "@/features/quiz/components/results-view/results-view";
import {
  createEmptyProgress,
  parseProgress,
  PROGRESS_STORAGE_KEY,
  serializeProgress,
  type TopicProgress,
} from "@/features/progress/services/progress/progress";
import { getSeedQuestionsForTopic, type OptionId } from "@/lib/questions";

const { push, redirect } = vi.hoisted(() => ({
  push: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT ${path}`);
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  redirect,
}));

const questions = getSeedQuestionsForTopic("js");
const OPTION_ORDER: OptionId[] = ["a", "b", "c", "d"];
const START = new Date(2026, 8, 16, 10, 0, 0);

function wrong(optionId: OptionId): OptionId {
  return optionId === "a" ? "b" : "a";
}

function Screen() {
  const { state } = useQuiz();
  return state.result === null ? <QuizView /> : <ResultsView />;
}

function seedJs(progress: TopicProgress) {
  const snapshot = createEmptyProgress();
  snapshot.topics.js = progress;
  snapshot.streakDays = 1;
  localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(snapshot));
}

function storedJs() {
  return parseProgress(localStorage.getItem(PROGRESS_STORAGE_KEY)).topics.js;
}

/** Plays a JS round: a pick per question, `null` to skip. */
async function play(picks: (OptionId | null)[], durationMs = 60_000) {
  const user = userEvent.setup();
  render(
    <QuizProvider topicId="js" questions={questions}>
      <Screen />
    </QuizProvider>,
    { reactStrictMode: true }
  );

  for (const [index, pick] of picks.entries()) {
    if (index === picks.length - 1) {
      vi.setSystemTime(START.getTime() + durationMs);
    }

    if (pick === null) {
      await user.click(screen.getByRole("button", { name: "Skip" }));
    } else {
      await user.click(
        screen.getAllByRole("radio")[OPTION_ORDER.indexOf(pick)]
      );
      await user.click(screen.getByRole("button", { name: "Next question" }));
    }
  }
}

function rows() {
  const table = screen.getByRole("table", {
    name: "JavaScript question breakdown",
  });
  return within(table).getAllByRole("row").slice(1);
}

describe("ResultsView", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(START);
    localStorage.clear();
    push.mockReset();
    redirect.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("redirects home when there is no finished round", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      render(
        <QuizProvider topicId="js" questions={questions}>
          <ResultsView />
        </QuizProvider>
      )
    ).toThrow("NEXT_REDIRECT /");
    expect(redirect).toHaveBeenCalledWith("/");
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    consoleError.mockRestore();
  });

  it("renders a 7/10 round with a new best, the delta and the breakdown", async () => {
    seedJs({
      bestScore: 6,
      attempts: 2,
      lastScore: 5,
      lastPlayedAt: new Date(2026, 8, 15).toISOString(),
    });
    const picks = questions.map((question, index): OptionId | null => {
      if (index === 3) {
        return wrong(question.correctOptionId);
      }

      if (index === 7) {
        return null;
      }

      if (index === 9) {
        return wrong(question.correctOptionId);
      }

      return question.correctOptionId;
    });

    await play(picks, 252_000);

    const ring = screen.getByRole("img", { name: "Score: 7 out of 10, 70%" });
    expect(ring.style.getPropertyValue("--score-ring-progress")).toBe("70%");
    expect(screen.getByText("New personal best")).toBeInTheDocument();
    expect(screen.getByText("+2 vs last round")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Strong round — you're interview-ready on the basics.",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("3 to review. Retry to lock them in.")
    ).toBeInTheDocument();

    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(
      ["Correct", "Missed", "Time"]
    );
    const [correct, missed, time] = screen.getAllByRole("definition");
    expect(correct).toHaveTextContent("7");
    expect(missed).toHaveTextContent("3");
    expect(within(time).getByText("4:12")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(within(time).getByText("4 minutes 12 seconds")).toHaveClass(
      "sr-only"
    );

    const breakdown = rows();
    expect(breakdown).toHaveLength(10);
    expect(breakdown.map((row) => row.getAttribute("data-result"))).toEqual([
      "correct",
      "correct",
      "correct",
      "incorrect",
      "correct",
      "correct",
      "correct",
      "skipped",
      "correct",
      "incorrect",
    ]);
    expect(within(breakdown[7]).getAllByRole("cell")[1]).toHaveTextContent(
      "Skipped"
    );
    expect(within(breakdown[0]).getByText("Correct")).toHaveClass("sr-only");

    expect(storedJs()).toEqual({
      bestScore: 7,
      attempts: 3,
      lastScore: 7,
      lastPlayedAt: new Date(START.getTime() + 252_000).toISOString(),
    });

    expect(screen.getByRole("link", { name: "Retry quiz" })).toHaveAttribute(
      "href",
      "/quiz/js"
    );
    expect(
      screen.getByRole("link", { name: "Back to topics" })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "TypeScript · 10 questions" })
    ).toHaveAttribute("href", "/quiz/ts");
  });

  it("renders a perfect first round without a delta badge", async () => {
    await play(questions.map((question) => question.correctOptionId));

    expect(
      screen.getByRole("img", { name: "Score: 10 out of 10, 100%" })
    ).toBeInTheDocument();
    expect(screen.getByText("New personal best")).toBeInTheDocument();
    expect(screen.queryByText(/vs last round/)).not.toBeInTheDocument();
    expect(
      screen.getByText("A perfect score. Retry any time to keep it sharp.")
    ).toBeInTheDocument();
    expect(
      rows().every((row) => row.getAttribute("data-result") === "correct")
    ).toBe(true);
    expect(
      screen.queryByRole("button", { name: "Review mistakes" })
    ).not.toBeInTheDocument();
    expect(storedJs()).toMatchObject({
      bestScore: 10,
      attempts: 1,
      lastScore: 10,
    });
  });

  it("renders a skipped 0/10 round with no badges", async () => {
    seedJs({
      bestScore: 8,
      attempts: 1,
      lastScore: 8,
      lastPlayedAt: new Date(2026, 8, 15).toISOString(),
    });

    await play(questions.map(() => null));

    expect(
      screen.getByRole("img", { name: "Score: 0 out of 10, 0%" })
    ).toBeInTheDocument();
    expect(screen.queryByText("New personal best")).not.toBeInTheDocument();
    expect(screen.queryByText(/vs last round/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Good start — let's review the fundamentals.",
      })
    ).toBeInTheDocument();

    for (const row of rows()) {
      expect(row).toHaveAttribute("data-result", "skipped");
      expect(within(row).getAllByRole("cell")[1]).toHaveTextContent("Skipped");
    }

    expect(storedJs()).toMatchObject({
      bestScore: 8,
      attempts: 2,
      lastScore: 0,
    });
  });

  it("reviews only the missed questions and returns to the same results", async () => {
    const missedIndexes = [3, 7];
    const picks = questions.map((question, index): OptionId | null => {
      if (index === 3) {
        return wrong(question.correctOptionId);
      }

      return index === 7 ? null : question.correctOptionId;
    });

    await play(picks);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Review mistakes" }));

    const [first, second] = missedIndexes.map((index) => questions[index]);
    const plain = (text: string) => text.replaceAll("`", "");

    expect(screen.getByText("Mistake 1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      plain(first.prompt)
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Next mistake" })).toBeDisabled();

    const wrongPick = wrong(first.correctOptionId);
    await user.click(
      screen.getAllByRole("radio")[OPTION_ORDER.indexOf(wrongPick)]
    );

    const radios = screen.getAllByRole("radio");
    expect(radios.map((radio) => radio.getAttribute("data-verdict"))).toEqual(
      OPTION_ORDER.map((id) =>
        id === first.correctOptionId
          ? "correct"
          : id === wrongPick
            ? "incorrect"
            : null
      )
    );
    expect(radios.every((radio) => radio.hasAttribute("disabled"))).toBe(true);

    const feedback = screen.getByText(
      `Not quite — the answer is ${first.correctOptionId.toUpperCase()}`
    ).parentElement;
    expect(feedback).toHaveFocus();
    expect(feedback).toHaveTextContent(plain(first.explanation ?? ""));

    await user.click(screen.getByRole("button", { name: "Next mistake" }));

    expect(screen.getByText("Mistake 2 of 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      plain(second.prompt)
    );

    await user.click(
      screen.getAllByRole("radio")[OPTION_ORDER.indexOf(second.correctOptionId)]
    );

    expect(screen.getByText("Correct")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to results" }));

    expect(
      screen.getByRole("img", { name: "Score: 8 out of 10, 80%" })
    ).toBeInTheDocument();
    expect(screen.getByText("New personal best")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Review mistakes" })
    ).toHaveFocus();
    expect(storedJs()).toMatchObject({ bestScore: 8, attempts: 1 });
  });
});
