# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev            # dev server on :3000
npm run build          # needs DATABASE_URL — quiz routes are prerendered from the DB
npm run typecheck      # next typegen && tsc --noEmit
npm run lint:fix       # then `npm run format` — together they fix all style errors
npm test               # vitest, single run
npx vitest run src/features/quiz/services/quiz            # one file / directory
npx vitest run src/lib/questions -t "unique ids"          # one test by name
```

Database (Neon Postgres + Drizzle). Copy `.env.example` to `.env.local` and set `DATABASE_URL`.

```bash
npm run db:generate    # schema.ts -> SQL migration in drizzle/
npm run db:migrate     # apply migrations
npm run db:seed        # DELETES all question rows, reinserts from src/lib/questions/*
npm run db:studio
```

`typecheck` must run `next typegen` first: the global `PageProps<"/route">` / `LayoutProps<"/route">` types used by every route file are generated, not imported.

## Architecture

Feature-driven: code is grouped by domain, not by kind.

- `src/app/` — routes only. No `_components/` folders; a route composes pieces from `features/`.
- `src/features/<domain>/{components,hooks,services}/` — a domain lives in exactly one place. Never split one across `lib/`, `hooks/` and `features/`.
- `src/components/` — domain-agnostic UI. A file here may import `@/components/ui/*` but no other `components/` subdirectory, and never `features/` or `hooks/`.
- `src/lib/` — feature-agnostic core (`questions/`, `db/`, `tones/`, `design-tokens/`, `inline-code/`). Imports nothing above it.
- `src/hooks/`, `src/utils/` — genuinely app-wide only. Utils are named `<name>.utils.ts`.

Dependencies point one way: `app/ → features/ → components/, lib/, utils/`. Features may import each other (`home → progress`, `quiz → sound`, `shell → theme`).

Every module gets its own directory named after it, holding the module and its test: `services/quiz/{quiz.ts, quiz.test.ts}`. `components/ui/` is the one exception — it stays flat so `shadcn add` keeps writing into it (`components.json` points `utils` at `@/utils/cn/cn.utils`).

Source files carry essentially no comments; keep it that way.

### Questions: static TS is the seed, Postgres is the runtime source

- `src/lib/questions/{css,html,js,ts}.ts` are the seed data and the test fixtures, reached through `getSeedQuestionsForTopic`. Tests never touch the database.
- At runtime questions come from `getQuestionsForTopic` in `src/lib/db/questions.ts` — `server-only`, `"use cache"` with `cacheLife("max")` and `cacheTag("questions")`. Nothing invalidates that tag yet, so reseeding only shows up after a redeploy.
- `topics` (`lib/questions/topics.ts`) is still static TS because client components read it directly.
- `TOPIC_IDS` and `OPTION_IDS` in `lib/questions/types.ts` feed the Postgres enums in `lib/db/schema.ts`; changing either needs a migration.
- Rows have no inherent order — the seed stores the array index in `position` and the query sorts on it.
- Drizzle uses `casing: "snake_case"` in both `drizzle.config.ts` and `lib/db/db.ts`; keep them in step. `db` is a lazy proxy, so importing it does not require `DATABASE_URL` until the first query.

### Quiz flow

`app/quiz/[topic]/layout.tsx` (server) validates the topic, fetches questions and hands them to `QuizProvider` (client) as a prop. That layout wraps both `/quiz/[topic]` and `/quiz/[topic]/results`, which is how the round survives the navigation: the reducer state (`features/quiz/services/quiz`) and the timing live in the provider's context, not in the URL or storage. `ResultsView` reads the result from context, records the attempt into the progress store once, and redirects to `/` when there is no result (e.g. a hard reload of the results URL).

`cacheComponents: true` is on in `next.config.ts`; the results page wraps its client view in `<Suspense>` because of it.

### Client-side stores (theme, progress, sound)

All three persist to `localStorage` and share one shape — follow it for any new persisted preference:

- `services/<x>/` — pure logic: storage key, parse/serialize, domain math. This is what the unit tests cover.
- `services/<x>-store/` — module-level listener set with `get…Snapshot`, `getServer…Snapshot`, `subscribeTo…` and a setter; listens to `storage` events for cross-tab sync and swallows `localStorage` errors.
- `hooks/use-<x>/` — a thin `useSyncExternalStore` wrapper.

The server snapshot is `null` (theme, progress) or the default (sound), so consumers must render a sensible pre-hydration state.

Theme is applied before first paint by `themeInitScript`, an inline script string in `features/theme/services/theme/theme.ts` rendered in the root layout's `<head>`. It re-implements `parsePreference` + `resolveTheme` by hand — change them together.

## Styling

Tailwind v4 with no config file; everything is in `src/app/globals.css`.

- Theme values are CSS custom properties declared once under the dark block and once under the light block. The two blocks must have identical key sets — `src/app/globals.test.ts` fails otherwise. `@theme inline` exposes them as utilities (`bg-glass`, `text-ink-muted`, `shadow-card`, `rounded-card`…).
- No color literals (`#hex`, `rgb()`, `oklch()`, `color-mix()`…) in any `.ts`/`.tsx` outside `lib/questions/` — `src/test/no-hardcoded-colors` scans every source file. Add a token instead.
- Adding a `--text-*`, `--radius-*` or `--shadow-*` token also means adding its name to `src/lib/design-tokens/design-tokens.ts`. `cn` (`createCn` from the `cn` package, in `utils/cn/cn.utils.ts`) uses those lists to merge classes correctly, and a test checks they match `globals.css`.
- Accent colors go through tones: `tone-css`, `tone-correct`, `tone-brand`… utilities point generic `--tone-*` slots at one palette. Components take a `tone` prop (`Tone` in `lib/tones/tones.ts`) rather than per-topic classes.
- One breakpoint only: `sm` = 520px (the defaults are reset, so `md:`/`lg:` do not exist). Base styles are the phone layout; `*-compact` tokens are the phone sizes.
- Use the custom `hovered:` variant instead of `hover:` — it is gated on `(hover: hover)` and can be pinned with `data-force-state` on the `/tokens` sheet. `dark:` is keyed on `[data-theme="dark"]`, not the media query.
- `/tokens` (404 in production) renders every primitive in every state in both themes — check it after touching tokens or `components/ui/`.

Prettier ignores `*.css` and `*.md`. ESLint adds three rules on top of the Next config: braces on every block (`curly: all`), a blank line before and after every block-like statement, and `===` only.

## Tests

Vitest + jsdom + React Testing Library, colocated as `*.test.ts(x)` under `src/`. Shared helpers and repo-wide checks live in `src/test/` (e.g. `installMatchMedia` for theme tests).
