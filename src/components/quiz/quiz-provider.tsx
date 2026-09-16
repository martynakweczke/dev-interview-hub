"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { getQuestionsForTopic, type OptionId, type TopicId } from "@/lib/questions"
import {
  createQuizState,
  quizReducer,
  type QuizAction,
  type QuizState,
} from "@/lib/quiz"

type QuizContextValue = {
  state: QuizState
  select: (optionId: OptionId) => void
  advance: () => void
  skip: () => void
  restart: () => void
}

const QuizContext = React.createContext<QuizContextValue | null>(null)

function initQuizState(topicId: TopicId): QuizState {
  return createQuizState(topicId, getQuestionsForTopic(topicId))
}

export function QuizProvider({
  topicId,
  children,
}: {
  topicId: TopicId
  children: React.ReactNode
}) {
  const router = useRouter()
  const [state, dispatch] = React.useReducer(quizReducer, topicId, initQuizState)

  const select = React.useCallback(
    (optionId: OptionId) => dispatch({ type: "select", optionId }),
    []
  )
  const restart = React.useCallback(() => dispatch({ type: "restart" }), [])

  function move(action: QuizAction) {
    const finishes = state.result === null && quizReducer(state, action).result !== null
    dispatch(action)
    if (finishes) router.push(`/quiz/${state.topicId}/results`)
  }

  const value: QuizContextValue = {
    state,
    select,
    advance: () => move({ type: "advance" }),
    skip: () => move({ type: "skip" }),
    restart,
  }

  return <QuizContext value={value}>{children}</QuizContext>
}

export function useQuiz(): QuizContextValue {
  const context = React.use(QuizContext)
  if (context === null) {
    throw new Error("useQuiz must be used inside <QuizProvider>")
  }
  return context
}
