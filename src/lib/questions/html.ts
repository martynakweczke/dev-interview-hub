import type { Question } from "@/lib/questions/types";

export const htmlQuestions: readonly Question[] = [
  {
    id: "html-nav-landmark",
    topicId: "html",
    prompt: "Which element should wrap a site's main navigation links?",
    options: [
      { id: "a", label: "`<section>`" },
      { id: "b", label: "`<nav>`" },
      { id: "c", label: "`<aside>`" },
      { id: "d", label: '`<div class="nav">`' },
    ],
    correctOptionId: "b",
    explanation:
      "`<nav>` exposes a navigation landmark that screen-reader users can jump straight to.",
  },
  {
    id: "html-img-alt",
    topicId: "html",
    prompt: "What is the `alt` attribute on `<img>` for?",
    options: [
      { id: "a", label: "A tooltip shown on hover" },
      { id: "b", label: "A backup image URL" },
      { id: "c", label: "A list of SEO keywords" },
      { id: "d", label: "A text alternative when the image can't be seen" },
    ],
    correctOptionId: "d",
    explanation:
      'Screen readers announce `alt` text and browsers show it if the image fails; decorative images use `alt=""`.',
  },
  {
    id: "html-button-vs-link",
    topicId: "html",
    prompt: "When should you use `<button>` instead of `<a>`?",
    options: [
      {
        id: "a",
        label: "For actions on the page, like submitting or toggling",
      },
      { id: "b", label: "For going to another URL" },
      { id: "c", label: "Whenever it's styled to look like a button" },
      { id: "d", label: "Only inside a `<form>`" },
    ],
    correctOptionId: "a",
    explanation:
      "Links navigate and buttons perform actions; picking the right one gives correct keyboard and screen-reader behavior for free.",
  },
  {
    id: "html-label-for",
    topicId: "html",
    prompt: "How do you associate a `<label>` with an `<input>`?",
    options: [
      { id: "a", label: "Give both the same `name`" },
      { id: "b", label: "Place the label right after the input" },
      { id: "c", label: "Set the label's `for` to the input's `id`" },
      { id: "d", label: "Add `aria-hidden` to the label" },
    ],
    correctOptionId: "c",
    explanation:
      "Matching `for` and `id` (or wrapping the input in the label) gives the input an accessible name and makes the label clickable.",
  },
  {
    id: "html-doctype",
    topicId: "html",
    prompt: "What does `<!DOCTYPE html>` do?",
    options: [
      { id: "a", label: "Loads the HTML5 feature library" },
      { id: "b", label: "Makes the browser render in standards mode" },
      { id: "c", label: "Declares the page's character set" },
      { id: "d", label: "Enables JavaScript on the page" },
    ],
    correctOptionId: "b",
    explanation:
      "Without a doctype, browsers fall back to quirks mode and emulate old, inconsistent layout behavior.",
  },
  {
    id: "html-inline-element",
    topicId: "html",
    prompt: "Which element is inline by default?",
    options: [
      { id: "a", label: "`<div>`" },
      { id: "b", label: "`<p>`" },
      { id: "c", label: "`<section>`" },
      { id: "d", label: "`<span>`" },
    ],
    correctOptionId: "d",
    explanation:
      "`<span>` flows within a line of text; `<div>`, `<p>` and `<section>` each start a new block box.",
  },
  {
    id: "html-script-defer",
    topicId: "html",
    prompt: "What does `defer` do on a `<script>` tag?",
    options: [
      {
        id: "a",
        label: "Downloads it in parallel and runs it after the HTML is parsed",
      },
      { id: "b", label: "Runs it the moment it finishes downloading" },
      { id: "c", label: "Waits until the user interacts with the page" },
      { id: "d", label: "Skips it on slow connections" },
    ],
    correctOptionId: "a",
    explanation:
      "Deferred scripts don't block parsing and run in document order before `DOMContentLoaded`; running on download is `async`.",
  },
  {
    id: "html-form-post",
    topicId: "html",
    prompt: 'What does `method="post"` on a `<form>` do?',
    options: [
      { id: "a", label: "Puts the data in the URL's query string" },
      { id: "b", label: "Encrypts the submitted data" },
      { id: "c", label: "Sends the form data in the request body" },
      { id: "d", label: "Validates every field before submitting" },
    ],
    correctOptionId: "c",
    explanation:
      "`post` sends the fields in the HTTP request body, while `get` appends them to the URL.",
  },
  {
    id: "html-dataset",
    topicId: "html",
    prompt: "How do you read a `data-user-id` attribute in JavaScript?",
    options: [
      { id: "a", label: '`element.data("user-id")`' },
      { id: "b", label: "`element.dataset.userId`" },
      { id: "c", label: "`element.dataUserId`" },
      { id: "d", label: "`element.attributes.userId`" },
    ],
    correctOptionId: "b",
    explanation:
      "`data-*` attributes appear on `dataset`, with their names converted from kebab-case to camelCase.",
  },
  {
    id: "html-meta-viewport",
    topicId: "html",
    prompt: "What does `width=device-width` in the viewport meta tag do?",
    options: [
      { id: "a", label: "Disables pinch-to-zoom" },
      { id: "b", label: "Loads a separate mobile stylesheet" },
      { id: "c", label: "Hides horizontal scrollbars" },
      { id: "d", label: "Sets the layout width to the device's screen width" },
    ],
    correctOptionId: "d",
    explanation:
      "Without it, mobile browsers lay the page out at a desktop width (about 980px) and shrink it to fit.",
  },
];
