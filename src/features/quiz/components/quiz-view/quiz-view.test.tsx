import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { QuizProvider, useQuiz } from "@/features/quiz/components/quiz-provider/quiz-provider"
import { QuizView } from "@/features/quiz/components/quiz-view/quiz-view"
import { getQuestionsForTopic, type OptionId } from "@/lib/questions"

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

const questions = getQuestionsForTopic("js")
const OPTION_ORDER: OptionId[] = ["a", "b", "c", "d"]

function ResultProbe() {
  const { result } = useQuiz().state
  if (result === null) return null

  const skipped = result.answers.filter((row) => row.selectedOptionId === null)
  return (
    <output>
      {result.score}/{result.answers.length} · {skipped.length} skipped
    </output>
  )
}

function Harness({ showQuiz = true }: { showQuiz?: boolean }) {
  return (
    <QuizProvider topicId="js">
      {showQuiz && <QuizView />}
      <ResultProbe />
    </QuizProvider>
  )
}

const nextButton = () => screen.getByRole("button", { name: "Next question" })
const skipButton = () => screen.getByRole("button", { name: "Skip" })
const radios = () => screen.getAllByRole("radio")

describe("QuizView", () => {
  beforeEach(() => {
    push.mockReset()
  })

  it("starts on the first question with Next disabled", () => {
    render(<Harness />)

    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument()
    expect(screen.getByText("9 left")).toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Round progress" })
    ).toHaveAttribute("aria-valuenow", "10")

    const heading = screen.getByRole("heading", { level: 1 })
    expect(within(heading).getByText("typeof null").tagName).toBe("CODE")
    expect(
      screen.getByRole("radiogroup", { name: heading.textContent ?? "" })
    ).toBeInTheDocument()

    expect(radios()).toHaveLength(4)
    for (const radio of radios()) expect(radio).not.toBeChecked()

    expect(nextButton()).toBeDisabled()
    expect(nextButton()).toHaveAccessibleDescription("Pick one answer to continue")
  })

  it("keeps exactly one option selected and enables Next", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole("radio", { name: /"object"/ }))
    expect(radios()[1]).toBeChecked()
    expect(nextButton()).toBeEnabled()
    expect(nextButton()).toHaveAccessibleDescription(
      "Option B selected · you can still change it"
    )

    await user.click(radios()[0])
    expect(radios()[0]).toBeChecked()
    expect(radios()[1]).not.toBeChecked()
    expect(screen.getByText(/Option A selected/)).toBeInTheDocument()
  })

  it("supports arrows, Enter and Space in the group, and Enter on Next", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.tab()
    expect(radios()[0]).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(radios()[0]).toBeChecked()

    // Radix checks on the deferred focus move, while the arrow is still held.
    await user.keyboard("{ArrowDown>}")
    expect(radios()[1]).toHaveFocus()
    expect(radios()[1]).toBeChecked()
    await user.keyboard("{/ArrowDown}")

    radios()[3].focus()
    await user.keyboard(" ")
    expect(radios()[3]).toBeChecked()

    await user.tab()
    expect(skipButton()).toHaveFocus()
    await user.tab()
    expect(nextButton()).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(screen.getByText("Question 2 of 10")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus()
    for (const radio of radios()) expect(radio).not.toBeChecked()
    expect(nextButton()).toBeDisabled()
  })

  it("plays a full round and opens the results with the answers in context", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    for (const [index, question] of questions.entries()) {
      expect(screen.getByText(`Question ${index + 1} of 10`)).toBeInTheDocument()

      if (index % 3 === 0) {
        await user.click(skipButton())
      } else {
        await user.click(radios()[OPTION_ORDER.indexOf(question.correctOptionId)])
        await user.click(nextButton())
      }
    }

    expect(screen.getByRole("status")).toHaveTextContent("6/10 · 4 skipped")
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith("/quiz/js/results")
    expect(skipButton()).toBeDisabled()
    expect(nextButton()).toBeDisabled()
  })

  it("starts a new round when returning to a finished quiz", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Harness />)

    for (let index = 0; index < questions.length; index++) {
      await user.click(skipButton())
    }
    expect(screen.getByRole("status")).toHaveTextContent("0/10 · 10 skipped")

    rerender(<Harness showQuiz={false} />)
    rerender(<Harness />)

    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(push).toHaveBeenCalledTimes(1)
  })
})
