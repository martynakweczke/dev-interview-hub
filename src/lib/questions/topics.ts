import type { Topic, TopicId } from "@/lib/questions/types"

export const topicsById: Record<TopicId, Topic> = {
  css: {
    id: "css",
    label: "CSS",
    glyph: "{ }",
    description: "Box model, the cascade, layout and units.",
    tone: "css",
  },
  html: {
    id: "html",
    label: "HTML",
    glyph: "</>",
    description: "Semantic elements, forms and accessibility basics.",
    tone: "html",
  },
  js: {
    id: "js",
    label: "JavaScript",
    glyph: "JS",
    description: "Types, scope, closures, arrays and promises.",
    tone: "js",
  },
  ts: {
    id: "ts",
    label: "TypeScript",
    glyph: "TS",
    description: "Types vs interfaces, narrowing, generics and utility types.",
    tone: "ts",
  },
}
