"use client"

import * as React from "react"

import { InlineCodeText } from "@/components/questions/inline-code-text"
import { AnswerOptions } from "@/components/quiz/answer-options"
import { useQuiz } from "@/components/quiz/quiz-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toneClasses } from "@/components/ui/tones"
import { getTopic } from "@/lib/questions"
import { getCurrentQuestion } from "@/lib/quiz"
import { cn } from "@/lib/utils"

export function QuizView() {
  const { state, select, advance, skip, restart } = useQuiz()
  const headingId = React.useId()
  const hintId = React.useId()
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const focusQuestionRef = React.useRef(false)
  const restartOnEntryRef = React.useRef(state.result !== null)

  React.useLayoutEffect(() => {
    if (!restartOnEntryRef.current) return
    restartOnEntryRef.current = false
    restart()
  }, [restart])

  React.useEffect(() => {
    if (!focusQuestionRef.current) return
    focusQuestionRef.current = false
    headingRef.current?.focus()
  }, [state.index])

  const question = getCurrentQuestion(state)
  const topic = getTopic(state.topicId)
  const finished = state.result !== null
  const selection = finished
    ? (state.answers[question.id] ?? null)
    : state.selection
  const total = state.questions.length
  const number = state.index + 1

  function moveOn(action: () => void) {
    focusQuestionRef.current = true
    action()
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-227 flex-1 flex-col px-gutter-compact pt-5 sm:px-gutter sm:pt-12 sm:pb-14",
        toneClasses[topic.tone]
      )}
    >
      <div className="flex flex-col gap-2.25 sm:gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-progress-label-compact font-semibold text-tone-ink sm:text-progress-label">
            Question {number} of {total}
          </p>
          <p className="text-caption text-ink-faint sm:hidden">Single choice</p>
          <p className="text-meta text-ink-faint max-sm:hidden">
            {total - number} left
          </p>
        </div>
        <Progress
          value={(number / total) * 100}
          size="xl"
          track="strong"
          fill="quiz"
          aria-label="Round progress"
          className="max-sm:h-2 max-sm:*:data-[slot=progress-indicator]:shadow-progress-glow-compact"
        />
      </div>

      <div className="mt-6 mb-4.5 flex flex-col gap-3 sm:my-8">
        <Badge tone="glass" size="chip" className="max-sm:hidden">
          Single choice
        </Badge>
        <h1
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-question-compact font-semibold text-pretty text-ink-primary outline-none sm:text-question"
        >
          <InlineCodeText text={question.prompt} variant="prompt" />
        </h1>
      </div>

      <AnswerOptions
        key={question.id}
        options={question.options}
        value={selection}
        onValueChange={select}
        disabled={finished}
        aria-labelledby={headingId}
      />

      <div className="sticky bottom-0 z-10 -mx-gutter-compact mt-auto flex items-center gap-3 bg-scrim-quiz px-gutter-compact pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:mt-8 sm:flex-wrap sm:justify-between sm:gap-x-6 sm:gap-y-3 sm:bg-none sm:px-0 sm:pt-2 sm:pb-0">
        <p id={hintId} className="text-hint text-ink-faint max-sm:sr-only">
          {selection === null
            ? "Pick one answer to continue"
            : `Option ${selection.toUpperCase()} selected · you can still change it`}
        </p>
        <div className="flex flex-1 items-center gap-3 sm:ml-auto sm:flex-none sm:gap-3.5">
          <Button
            variant="secondary"
            size="compact"
            disabled={finished}
            onClick={() => moveOn(skip)}
            className="sm:min-h-0 sm:rounded-control-sm sm:border-transparent sm:bg-transparent sm:px-5.5 sm:py-3.5 sm:enabled:hovered:bg-transparent sm:enabled:hovered:text-ink-secondary"
          >
            Skip
          </Button>
          <Button
            size="compact"
            disabled={selection === null || finished}
            aria-describedby={hintId}
            onClick={() => moveOn(advance)}
            className="flex-1 sm:flex-none sm:px-8.5"
          >
            Next question
            <span aria-hidden="true" className="-ml-1 max-sm:hidden">
              →
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
