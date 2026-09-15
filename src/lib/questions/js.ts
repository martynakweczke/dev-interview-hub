import type { Question } from "@/lib/questions/types"

export const jsQuestions: readonly Question[] = [
  {
    id: "js-typeof-null",
    topicId: "js",
    prompt: "What does `typeof null` evaluate to in JavaScript?",
    options: [
      { id: "a", label: "The string `\"null\"`" },
      { id: "b", label: "The string `\"object\"`" },
      { id: "c", label: "The string `\"undefined\"`" },
      { id: "d", label: "It throws a `TypeError`" },
    ],
    correctOptionId: "b",
    explanation:
      "A bug from the first version of JavaScript: `null` shared the object type tag, and it was never fixed for compatibility.",
  },
  {
    id: "js-block-scope",
    topicId: "js",
    prompt: "Which keyword declares a block-scoped variable?",
    options: [
      { id: "a", label: "`var`" },
      { id: "b", label: "`function`" },
      { id: "c", label: "`let`" },
      { id: "d", label: "`void`" },
    ],
    correctOptionId: "c",
    explanation:
      "`let` and `const` are scoped to the nearest block; `var` is scoped to the whole function.",
  },
  {
    id: "js-array-map",
    topicId: "js",
    prompt: "What does `Array.prototype.map()` return?",
    options: [
      { id: "a", label: "A new array" },
      { id: "b", label: "The original array, changed in place" },
      { id: "c", label: "`undefined`" },
      { id: "d", label: "The number of items" },
    ],
    correctOptionId: "a",
    explanation:
      "`map` builds a new array from each callback's return value and leaves the original untouched.",
  },
  {
    id: "js-string-plus-number",
    topicId: "js",
    prompt: "What does `\"5\" + 3` evaluate to?",
    options: [
      { id: "a", label: "`8`" },
      { id: "b", label: "`\"8\"`" },
      { id: "c", label: "`NaN`" },
      { id: "d", label: "`\"53\"`" },
    ],
    correctOptionId: "d",
    explanation:
      "If either operand of `+` is a string, the other is converted to a string and the two are concatenated.",
  },
  {
    id: "js-array-pop",
    topicId: "js",
    prompt: "Which method removes the last item from an array?",
    options: [
      { id: "a", label: "`shift()`" },
      { id: "b", label: "`pop()`" },
      { id: "c", label: "`slice(-1)`" },
      { id: "d", label: "`unshift()`" },
    ],
    correctOptionId: "b",
    explanation:
      "`pop` removes and returns the last element; `slice(-1)` only copies it and `shift` works on the first element.",
  },
  {
    id: "js-closure",
    topicId: "js",
    prompt: "What is a closure?",
    options: [
      { id: "a", label: "A function that calls itself" },
      { id: "b", label: "A function that runs as soon as it's defined" },
      {
        id: "c",
        label: "A function plus the variables of the scope it was created in",
      },
      { id: "d", label: "A statement that stops a loop early" },
    ],
    correctOptionId: "c",
    explanation:
      "Inner functions keep access to their outer scope's variables, even after the outer function has returned.",
  },
  {
    id: "js-strict-equality",
    topicId: "js",
    prompt: "How does `===` differ from `==`?",
    options: [
      { id: "a", label: "It compares without type coercion" },
      { id: "b", label: "It only compares object references" },
      { id: "c", label: "It deep-compares objects and arrays" },
      { id: "d", label: "It's identical, just faster" },
    ],
    correctOptionId: "a",
    explanation:
      "`==` converts both operands to a common type first (`0 == \"\"` is `true`); `===` also requires the same type.",
  },
  {
    id: "js-promise-all",
    topicId: "js",
    prompt: "What does `Promise.all` reject with?",
    options: [
      { id: "a", label: "An array of every rejection reason" },
      { id: "b", label: "`undefined`" },
      { id: "c", label: "The last rejection reason" },
      { id: "d", label: "The first rejection reason" },
    ],
    correctOptionId: "d",
    explanation:
      "It rejects as soon as any promise rejects, with that reason; `Promise.allSettled` collects every outcome instead.",
  },
  {
    id: "js-primitive-types",
    topicId: "js",
    prompt: "Which of these is NOT a primitive type?",
    options: [
      { id: "a", label: "`symbol`" },
      { id: "b", label: "`bigint`" },
      { id: "c", label: "`object`" },
      { id: "d", label: "`boolean`" },
    ],
    correctOptionId: "c",
    explanation:
      "The primitives are `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol` and `null`; objects, arrays and functions are not.",
  },
  {
    id: "js-arrow-this",
    topicId: "js",
    prompt: "What does `this` refer to inside an arrow function?",
    options: [
      { id: "a", label: "A new `this` created for each call" },
      { id: "b", label: "The `this` of the enclosing scope" },
      { id: "c", label: "Always the global object" },
      { id: "d", label: "The element that fired the event" },
    ],
    correctOptionId: "b",
    explanation:
      "Arrow functions don't bind their own `this`; they use the `this` of the code they were defined in.",
  },
]
