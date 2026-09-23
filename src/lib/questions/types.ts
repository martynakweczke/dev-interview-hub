import type { Tone } from "@/lib/tones/tones";

export const TOPIC_IDS = [
  "css",
  "html",
  "js",
  "ts",
] as const satisfies readonly Tone[];

export type TopicId = (typeof TOPIC_IDS)[number];

export const QUESTIONS_PER_ROUND = 10;

export type Topic = {
  id: TopicId;
  label: string;
  glyph: string;
  description: string;
  tone: Tone;
};

export type OptionId = "a" | "b" | "c" | "d";

export type Option = {
  id: OptionId;
  label: string;
};

export type Question = {
  id: string;
  topicId: TopicId;
  prompt: string;
  options: [Option, Option, Option, Option];
  correctOptionId: OptionId;
  explanation?: string;
};
