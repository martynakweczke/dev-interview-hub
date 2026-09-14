import type { Question } from "@/lib/questions/types"

export const cssQuestions: readonly Question[] = [
  {
    id: "css-box-sizing",
    topicId: "css",
    prompt: "What does `box-sizing: border-box` change?",
    options: [
      { id: "a", label: "Borders are drawn outside the margin" },
      { id: "b", label: "`width` includes padding and border" },
      { id: "c", label: "`width` excludes padding" },
      { id: "d", label: "The element becomes a block box" },
    ],
    correctOptionId: "b",
    explanation:
      "With `border-box`, padding and border are counted inside the declared `width` and `height` instead of adding to them.",
  },
  {
    id: "css-specificity",
    topicId: "css",
    prompt: "Which selector has the highest specificity?",
    options: [
      { id: "a", label: "`.nav .link`" },
      { id: "b", label: "`nav a:hover`" },
      { id: "c", label: "`#main`" },
      { id: "d", label: "`*`" },
    ],
    correctOptionId: "c",
    explanation:
      "One ID selector outweighs any number of class, pseudo-class, attribute or type selectors.",
  },
  {
    id: "css-visibility-hidden",
    topicId: "css",
    prompt: "How does `visibility: hidden` differ from `display: none`?",
    options: [
      { id: "a", label: "The element still takes up space in the layout" },
      { id: "b", label: "The element is removed from the DOM" },
      { id: "c", label: "The element stays clickable" },
      { id: "d", label: "Only the element's children are hidden" },
    ],
    correctOptionId: "a",
    explanation:
      "`visibility: hidden` hides the box but keeps its space; `display: none` removes it from the layout entirely.",
  },
  {
    id: "css-position-absolute",
    topicId: "css",
    prompt: "What is an element with `position: absolute` positioned against?",
    options: [
      { id: "a", label: "The viewport, always" },
      { id: "b", label: "Its previous sibling" },
      { id: "c", label: "The `<body>` element, always" },
      { id: "d", label: "Its nearest positioned ancestor" },
    ],
    correctOptionId: "d",
    explanation:
      "It uses the nearest ancestor whose `position` isn't `static`, falling back to the initial containing block.",
  },
  {
    id: "css-rem-unit",
    topicId: "css",
    prompt: "What is `1rem` relative to?",
    options: [
      { id: "a", label: "The parent element's font size" },
      { id: "b", label: "The root element's font size" },
      { id: "c", label: "1% of the viewport width" },
      { id: "d", label: "The browser window's height" },
    ],
    correctOptionId: "b",
    explanation:
      "`rem` always follows the `<html>` font size, so it doesn't compound through nesting the way `em` does.",
  },
  {
    id: "css-justify-content",
    topicId: "css",
    prompt:
      "In a `flex-direction: row` container, which property distributes items along the main axis?",
    options: [
      { id: "a", label: "`justify-content`" },
      { id: "b", label: "`align-items`" },
      { id: "c", label: "`align-content`" },
      { id: "d", label: "`vertical-align`" },
    ],
    correctOptionId: "a",
    explanation:
      "`justify-content` works on the main axis (horizontal in a row); `align-items` works on the cross axis.",
  },
  {
    id: "css-rgba-alpha",
    topicId: "css",
    prompt: "In `rgba(0, 0, 0, 0.5)`, what does `0.5` control?",
    options: [
      { id: "a", label: "Brightness" },
      { id: "b", label: "The blue channel" },
      { id: "c", label: "Alpha, so the color is 50% transparent" },
      { id: "d", label: "Blur radius" },
    ],
    correctOptionId: "c",
    explanation:
      "The fourth value is the alpha channel: `0` is fully transparent and `1` is fully opaque.",
  },
  {
    id: "css-pseudo-element",
    topicId: "css",
    prompt: "Which of these is a pseudo-element?",
    options: [
      { id: "a", label: "`:hover`" },
      { id: "b", label: "`:first-child`" },
      { id: "c", label: "`:focus-visible`" },
      { id: "d", label: "`::before`" },
    ],
    correctOptionId: "d",
    explanation:
      "Pseudo-elements (double colon) style part of an element or generated content; pseudo-classes (single colon) match a state.",
  },
  {
    id: "css-source-order",
    topicId: "css",
    prompt:
      "Two rules with equal specificity set `color` on the same element. Which one wins?",
    options: [
      { id: "a", label: "The one declared last" },
      { id: "b", label: "The one declared first" },
      { id: "c", label: "The one with more selectors" },
      { id: "d", label: "Neither — the browser default applies" },
    ],
    correctOptionId: "a",
    explanation:
      "When origin, importance and specificity tie, source order decides: the later declaration wins.",
  },
  {
    id: "css-media-min-width",
    topicId: "css",
    prompt: "Which viewports does `@media (min-width: 520px)` match?",
    options: [
      { id: "a", label: "Narrower than 520px" },
      { id: "b", label: "520px wide or wider" },
      { id: "c", label: "Exactly 520px wide" },
      { id: "d", label: "Only printed pages" },
    ],
    correctOptionId: "b",
    explanation:
      "`min-width` applies once the viewport is at least that wide, which makes it the usual mobile-first breakpoint.",
  },
]
