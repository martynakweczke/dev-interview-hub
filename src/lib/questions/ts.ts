import type { Question } from "@/lib/questions/types";

export const tsQuestions: readonly Question[] = [
  {
    id: "ts-interface-merging",
    topicId: "ts",
    prompt: "What can an `interface` do that a `type` alias can't?",
    options: [
      { id: "a", label: "Describe the shape of an object" },
      { id: "b", label: "Be merged by declaring it again" },
      { id: "c", label: "Be exported from a module" },
      { id: "d", label: "Describe a function signature" },
    ],
    correctOptionId: "b",
    explanation:
      "Declaring an `interface` twice merges the two declarations; a second `type` alias with the same name is an error.",
  },
  {
    id: "ts-unknown-vs-any",
    topicId: "ts",
    prompt: "How does `unknown` differ from `any`?",
    options: [
      { id: "a", label: "You must narrow it before using it" },
      { id: "b", label: "It can't hold objects" },
      { id: "c", label: "It turns off type checking" },
      { id: "d", label: "It only exists at runtime" },
    ],
    correctOptionId: "a",
    explanation:
      "`any` skips checks entirely; `unknown` accepts any value but makes you check its type before using it.",
  },
  {
    id: "ts-optional-property",
    topicId: "ts",
    prompt: "What does the `?` in `name?: string` mean?",
    options: [
      { id: "a", label: "The value may be `null`" },
      { id: "b", label: "The property is read-only" },
      { id: "c", label: "The value is a string or a number" },
      { id: "d", label: "The property may be missing" },
    ],
    correctOptionId: "d",
    explanation:
      "An optional property can be left out, so reading it gives `string | undefined`.",
  },
  {
    id: "ts-union-type",
    topicId: "ts",
    prompt: "What does the type `string | number` describe?",
    options: [
      { id: "a", label: "A value that is both a string and a number" },
      { id: "b", label: "A value that is either a string or a number" },
      { id: "c", label: "A tuple of a string and a number" },
      { id: "d", label: "A string that contains a number" },
    ],
    correctOptionId: "b",
    explanation:
      "`|` builds a union, where the value can be any one member; `&` builds an intersection.",
  },
  {
    id: "ts-generic-parameter",
    topicId: "ts",
    prompt: "In `function first<T>(items: T[]): T`, what is `T`?",
    options: [
      { id: "a", label: "A runtime variable holding the array" },
      { id: "b", label: "Always `unknown`" },
      { id: "c", label: "A type parameter filled in at each call" },
      { id: "d", label: "The type of `this`" },
    ],
    correctOptionId: "c",
    explanation:
      '`T` is inferred from the argument, so `first([1, 2])` returns `number` and `first(["a"])` returns `string`.',
  },
  {
    id: "ts-readonly",
    topicId: "ts",
    prompt: "What does `readonly` on a property prevent?",
    options: [
      { id: "a", label: "Reassigning it after the object is created" },
      { id: "b", label: "Changing values nested inside it" },
      { id: "c", label: "Reading it outside the class" },
      { id: "d", label: "Deleting it at runtime" },
    ],
    correctOptionId: "a",
    explanation:
      "`readonly` is a compile-time check on reassignment only; it isn't deep and doesn't exist at runtime.",
  },
  {
    id: "ts-typeof-narrowing",
    topicId: "ts",
    prompt:
      'Inside `if (typeof value === "string") { … }`, what is the type of `value`?',
    options: [
      { id: "a", label: "`unknown`" },
      { id: "b", label: "`any`" },
      { id: "c", label: "`never`" },
      { id: "d", label: "`string`" },
    ],
    correctOptionId: "d",
    explanation:
      "A `typeof` check is a type guard, so TypeScript narrows the variable to `string` inside the block.",
  },
  {
    id: "ts-never",
    topicId: "ts",
    prompt: "When does TypeScript give a value the type `never`?",
    options: [
      { id: "a", label: "When the value is `null`" },
      { id: "b", label: "When every possible type has been ruled out" },
      { id: "c", label: "When a function returns nothing" },
      { id: "d", label: "When a property is optional" },
    ],
    correctOptionId: "b",
    explanation:
      "`never` means no value can exist, like after an exhaustive `switch`; a function that returns nothing is `void`.",
  },
  {
    id: "ts-as-const",
    topicId: "ts",
    prompt: 'What type does `["a", "b"] as const` have?',
    options: [
      { id: "a", label: "`string[]`" },
      { id: "b", label: "`const string[]`" },
      { id: "c", label: '`readonly ["a", "b"]`' },
      { id: "d", label: '`Array<"a" | "b">`' },
    ],
    correctOptionId: "c",
    explanation:
      "`as const` keeps the literal types and makes the result a read-only tuple; it's type-level only and freezes nothing at runtime.",
  },
  {
    id: "ts-partial",
    topicId: "ts",
    prompt: "What does `Partial<User>` produce?",
    options: [
      { id: "a", label: "`User` with every property optional" },
      { id: "b", label: "`User` with every property required" },
      { id: "c", label: "`User` with only some chosen keys" },
      { id: "d", label: "`User` without its methods" },
    ],
    correctOptionId: "a",
    explanation:
      "`Partial` adds `?` to every property; `Required` removes it and `Pick` selects a subset of keys.",
  },
];
