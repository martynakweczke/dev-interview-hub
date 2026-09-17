import type { OptionId, Question, TopicId } from "@/lib/questions/types"

export type QuizAnswers = Record<string, OptionId | null>

export type QuizAnswer = {
  question: Question
  selectedOptionId: OptionId | null
  isCorrect: boolean
}

export type QuizResult = {
  topicId: TopicId
  score: number
  percentage: number
  answers: QuizAnswer[]
}

export type QuizState = {
  topicId: TopicId
  questions: readonly Question[]
  index: number
  answers: QuizAnswers
  selection: OptionId | null
  result: QuizResult | null
}

export type QuizAction =
  | { type: "select"; optionId: OptionId }
  | { type: "advance" }
  | { type: "skip" }
  | { type: "restart" }

export function createQuizState(
  topicId: TopicId,
  questions: readonly Question[]
): QuizState {
  if (questions.length === 0) {
    throw new RangeError(`A quiz needs at least one question, got none for ${topicId}`)
  }

  return {
    topicId,
    questions,
    index: 0,
    answers: {},
    selection: null,
    result: null,
  }
}

export function getCurrentQuestion(state: QuizState): Question {
  return state.questions[state.index]
}

export function getQuizResult(
  topicId: TopicId,
  questions: readonly Question[],
  answers: QuizAnswers
): QuizResult {
  const rows = questions.map((question): QuizAnswer => {
    const selectedOptionId = answers[question.id] ?? null
    return {
      question,
      selectedOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    }
  })
  const score = rows.filter((row) => row.isCorrect).length

  return {
    topicId,
    score,
    percentage: Math.round((score / questions.length) * 100),
    answers: rows,
  }
}

function recordAnswer(state: QuizState, optionId: OptionId | null): QuizState {
  const answers = { ...state.answers, [getCurrentQuestion(state).id]: optionId }
  const isLast = state.index === state.questions.length - 1

  return {
    ...state,
    answers,
    selection: null,
    index: isLast ? state.index : state.index + 1,
    result: isLast
      ? getQuizResult(state.topicId, state.questions, answers)
      : null,
  }
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === "restart") {
    return createQuizState(state.topicId, state.questions)
  }
  if (state.result !== null) return state

  switch (action.type) {
    case "select":
      return state.selection === action.optionId
        ? state
        : { ...state, selection: action.optionId }
    case "advance":
      return state.selection === null
        ? state
        : recordAnswer(state, state.selection)
    case "skip":
      return recordAnswer(state, null)
  }
}
