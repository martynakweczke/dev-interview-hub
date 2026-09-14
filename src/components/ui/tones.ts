export const toneClasses = {
  css: "tone-css",
  html: "tone-html",
  js: "tone-js",
  ts: "tone-ts",
  correct: "tone-correct",
  incorrect: "tone-incorrect",
  brand: "tone-brand",
  streak: "tone-streak",
  neutral: "tone-neutral",
  glass: "tone-glass",
} as const

export type Tone = keyof typeof toneClasses
