import { describe, expect, it } from "vitest";

import {
  getSeedQuestionsForTopic,
  getTopic,
  isTopicId,
  questions,
  QUESTIONS_PER_ROUND,
  TOPIC_IDS,
  topics,
} from "@/lib/questions";
import { validateQuestion } from "@/lib/questions/validate-question/validate-question";
import { toneClasses } from "@/lib/tones/tones";

describe("topics", () => {
  it("lists every topic once, in order", () => {
    expect(topics.map((topic) => topic.id)).toEqual([...TOPIC_IDS]);
  });

  it("points every topic at an existing tone", () => {
    for (const topic of topics) {
      expect(Object.keys(toneClasses), topic.id).toContain(topic.tone);
    }
  });

  it("has a label, glyph and description for every topic", () => {
    for (const topic of topics) {
      expect(topic.label.trim(), topic.id).not.toBe("");
      expect(topic.glyph.trim(), topic.id).not.toBe("");
      expect(topic.description.trim(), topic.id).not.toBe("");
    }
  });

  it("recognizes only real topic ids", () => {
    expect(isTopicId("js")).toBe(true);
    expect(isTopicId("javascript")).toBe(false);
    expect(isTopicId("constructor")).toBe(false);
    expect(isTopicId(undefined)).toBe(false);
    expect(getTopic("ts").label).toBe("TypeScript");
  });
});

describe("question set", () => {
  it.each(TOPIC_IDS)("has %s questions for a full round", (topicId) => {
    const topicQuestions = getSeedQuestionsForTopic(topicId);
    expect(topicQuestions).toHaveLength(QUESTIONS_PER_ROUND);
    expect(topicQuestions.every((q) => q.topicId === topicId)).toBe(true);
  });

  it("has 40 questions with unique ids", () => {
    const ids = questions.map((question) => question.id);
    expect(ids).toHaveLength(TOPIC_IDS.length * QUESTIONS_PER_ROUND);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes the README's JavaScript set", () => {
    expect(getSeedQuestionsForTopic("js").map((q) => q.id)).toEqual([
      "js-typeof-null",
      "js-block-scope",
      "js-array-map",
      "js-string-plus-number",
      "js-array-pop",
      "js-closure",
      "js-strict-equality",
      "js-promise-all",
      "js-primitive-types",
      "js-arrow-this",
    ]);
  });
});

describe.each(questions.map((question) => [question.id, question] as const))(
  "%s",
  (_id, question) => {
    it("passes the question rules", () => {
      expect(
        validateQuestion({
          ...question,
          explanation: question.explanation ?? "",
        })
      ).toEqual({});
    });

    it("is namespaced by a real topic", () => {
      expect(isTopicId(question.topicId)).toBe(true);
      expect(question.id.startsWith(`${question.topicId}-`)).toBe(true);
    });
  }
);
