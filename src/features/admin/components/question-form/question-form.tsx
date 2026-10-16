"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "@/features/admin/services/create-question/create-question";
import {
  initialQuestionFormState,
  optionFieldName,
} from "@/features/admin/services/question-form-state/question-form-state";
import { isTopicId, topics, topicsById } from "@/lib/questions/topics";
import { OPTION_IDS } from "@/lib/questions/types";
import type { QuestionErrorKey } from "@/lib/questions/validate-question/validate-question";

function FieldMessage({
  id,
  tone,
  children,
}: {
  id: string;
  tone: "hint" | "error";
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className={
        tone === "error"
          ? "tone-incorrect text-meta text-tone-ink"
          : "text-meta text-ink-muted"
      }
    >
      {children}
    </p>
  );
}

export function QuestionForm() {
  const [state, formAction, pending] = useActionState(
    createQuestion,
    initialQuestionFormState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const { errors, values } = state;
  const savedTopic = isTopicId(values.topicId)
    ? topicsById[values.topicId].label
    : null;

  function describedBy(key: QuestionErrorKey, hintId?: string) {
    return (
      [hintId, errors[key] ? `${key}-error` : undefined]
        .filter(Boolean)
        .join(" ") || undefined
    );
  }

  useEffect(() => {
    const form = formRef.current;

    if (!form || state.status === "idle") {
      return;
    }

    if (state.status === "saved") {
      form.querySelector<HTMLElement>("#prompt")?.focus();

      return;
    }

    const invalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
    const target = invalid?.matches("[role='radiogroup']")
      ? invalid.querySelector<HTMLElement>("[role='radio']")
      : invalid;

    target?.focus();
  }, [state]);

  return (
    <div className="flex flex-col gap-5">
      <form
        key={state.submission}
        ref={formRef}
        action={formAction}
        noValidate
        className="flex flex-col gap-6"
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-meta font-medium text-ink-secondary">
            Topic
          </legend>
          <RadioGroup
            name="topicId"
            defaultValue={values.topicId || undefined}
            aria-invalid={errors.topicId ? true : undefined}
            aria-describedby={describedBy("topicId")}
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center gap-2.5">
                <RadioGroupItem id={`topic-${topic.id}`} value={topic.id} />
                <Label htmlFor={`topic-${topic.id}`}>{topic.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.topicId && (
            <FieldMessage id="topicId-error" tone="error">
              {errors.topicId}
            </FieldMessage>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="prompt">Question</Label>
          <Textarea
            id="prompt"
            name="prompt"
            rows={3}
            defaultValue={values.prompt}
            aria-invalid={errors.prompt ? true : undefined}
            aria-describedby={describedBy("prompt", "prompt-hint")}
          />
          <FieldMessage id="prompt-hint" tone="hint">
            Wrap code in backticks: `like this`.
          </FieldMessage>
          {errors.prompt && (
            <FieldMessage id="prompt-error" tone="error">
              {errors.prompt}
            </FieldMessage>
          )}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-meta font-medium text-ink-secondary">
            Answers
          </legend>
          <FieldMessage id="answers-hint" tone="hint">
            Mark the correct one.
          </FieldMessage>
          <RadioGroup
            name="correctOptionId"
            defaultValue={values.correctOptionId || undefined}
            aria-label="Correct answer"
            aria-invalid={errors.correctOptionId ? true : undefined}
            aria-describedby={describedBy("correctOptionId", "answers-hint")}
            className="flex flex-col gap-3"
          >
            {OPTION_IDS.map((id) => {
              const key: QuestionErrorKey = `options.${id}`;
              const letter = id.toUpperCase();
              const label =
                values.options.find((option) => option.id === id)?.label ?? "";

              return (
                <div key={id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={id}
                      aria-label={`Answer ${letter} is correct`}
                    />
                    <Label
                      htmlFor={optionFieldName(id)}
                      className="w-4 font-display font-bold text-ink-tertiary"
                    >
                      {letter}
                    </Label>
                    <Input
                      id={optionFieldName(id)}
                      name={optionFieldName(id)}
                      defaultValue={label}
                      aria-label={`Answer ${letter}`}
                      aria-invalid={errors[key] ? true : undefined}
                      aria-describedby={describedBy(key)}
                    />
                  </div>
                  {errors[key] && (
                    <FieldMessage id={`${key}-error`} tone="error">
                      {errors[key]}
                    </FieldMessage>
                  )}
                </div>
              );
            })}
          </RadioGroup>
          {errors.options && (
            <FieldMessage id="options-error" tone="error">
              {errors.options}
            </FieldMessage>
          )}
          {errors.correctOptionId && (
            <FieldMessage id="correctOptionId-error" tone="error">
              {errors.correctOptionId}
            </FieldMessage>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="explanation">Explanation</Label>
          <Input
            id="explanation"
            name="explanation"
            defaultValue={values.explanation}
            aria-invalid={errors.explanation ? true : undefined}
            aria-describedby={describedBy("explanation", "explanation-hint")}
          />
          <FieldMessage id="explanation-hint" tone="hint">
            One line, shown when reviewing a wrong answer.
          </FieldMessage>
          {errors.explanation && (
            <FieldMessage id="explanation-error" tone="error">
              {errors.explanation}
            </FieldMessage>
          )}
        </div>

        <Button
          type="submit"
          size="compact"
          disabled={pending}
          className="self-start"
        >
          {pending ? "Adding…" : "Add question"}
        </Button>
      </form>

      <p role="status" className="text-meta text-ink-muted empty:hidden">
        {state.status === "saved" && `Question added to ${savedTopic}.`}
        {state.status === "invalid" &&
          "Fix the highlighted fields and try again."}
      </p>
    </div>
  );
}
