"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  createQuizState,
  quizReducer,
  type QuizAction,
  type QuizState,
} from "@/features/quiz/services/quiz/quiz";
import { playSelectSound } from "@/features/sound/services/sound-player/sound-player";
import type { OptionId, Question, TopicId } from "@/lib/questions";

type QuizTiming = {
  completedAt: Date;
  durationMs: number;
};

type QuizContextValue = {
  state: QuizState;
  timing: QuizTiming | null;
  select: (optionId: OptionId) => void;
  advance: () => void;
  skip: () => void;
  restart: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

type QuizInit = {
  topicId: TopicId;
  questions: readonly Question[];
};

function initQuizState({ topicId, questions }: QuizInit): QuizState {
  return createQuizState(topicId, questions);
}

export function QuizProvider({
  topicId,
  questions,
  children,
}: {
  topicId: TopicId;
  questions: readonly Question[];
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    quizReducer,
    { topicId, questions },
    initQuizState
  );
  const [timing, setTiming] = useState<QuizTiming | null>(null);
  const startedAtRef = useRef(0);

  const select = useCallback((optionId: OptionId) => {
    dispatch({ type: "select", optionId });
    playSelectSound();
  }, []);
  const restart = useCallback(() => {
    startedAtRef.current = Date.now();
    setTiming(null);
    dispatch({ type: "restart" });
  }, []);

  function move(action: QuizAction) {
    const finishes =
      state.result === null && quizReducer(state, action).result !== null;
    dispatch(action);

    if (finishes) {
      const completedAt = new Date();
      setTiming({
        completedAt,
        durationMs: Math.max(0, completedAt.getTime() - startedAtRef.current),
      });
      router.push(`/quiz/${state.topicId}/results`);
    }
  }

  const value: QuizContextValue = {
    state,
    timing,
    select,
    advance: () => move({ type: "advance" }),
    skip: () => move({ type: "skip" }),
    restart,
  };

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  return <QuizContext value={value}>{children}</QuizContext>;
}

export function useQuiz(): QuizContextValue {
  const context = use(QuizContext);

  if (context === null) {
    throw new Error("useQuiz must be used inside <QuizProvider>");
  }

  return context;
}
