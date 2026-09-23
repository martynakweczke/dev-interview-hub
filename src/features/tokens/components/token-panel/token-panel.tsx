import * as React from "react";

import { SiteHeader } from "@/features/shell/components/site-header/site-header";
import { Surface } from "@/components/surface/surface";
import { ThemeToggle } from "@/features/theme/components/theme-toggle/theme-toggle";
import { TopicCard } from "@/features/progress/components/topic-card/topic-card";
import { TopicIconTile } from "@/components/topic-icon-tile/topic-icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toneClasses, type Tone } from "@/lib/tones/tones";
import type { TopicProgress } from "@/features/progress/services/progress/progress";
import { getTopic } from "@/lib/questions";
import { cn } from "@/utils/cn/cn.utils";

const surfaceSwatches = [
  ["bg/root", "bg-root"],
  ["bg/panel-top", "bg-panel-top"],
  ["bg/panel-bottom", "bg-panel-bottom"],
  ["surface/glass", "bg-glass"],
  ["surface/glass-strong", "bg-glass-strong"],
  ["surface/glass-hover", "bg-glass-hover"],
  ["table-header", "bg-table-header"],
  ["progress-track", "bg-track"],
  ["progress-track/strong", "bg-track-strong"],
  ["neutral-fill", "bg-neutral-fill"],
  ["toggle-active", "bg-toggle-active"],
  ["secondary-hover", "bg-secondary-hover"],
  ["disabled-fill", "bg-disabled-fill"],
  ["incorrect-row", "bg-incorrect-row"],
] as const;

const lineSwatches = [
  ["border/hairline", "border-line"],
  ["border/header", "border-line-header"],
  ["border/row", "border-line-row"],
  ["border/subtle", "border-line-subtle"],
  ["border/soft", "border-line-soft"],
  ["border/strong", "border-line-strong"],
  ["border/disabled", "border-disabled-line"],
] as const;

const inkSwatches = [
  ["ink/primary", "text-ink-primary"],
  ["ink/heading-alt", "text-ink-heading-alt"],
  ["ink/secondary", "text-ink-secondary"],
  ["ink/tertiary", "text-ink-tertiary"],
  ["ink/muted", "text-ink-muted"],
  ["ink/faint", "text-ink-faint"],
  ["ink/faintest", "text-ink-faintest"],
  ["ink/disabled", "text-ink-disabled"],
  ["accent-link", "text-accent-link"],
  ["focus-ring", "text-focus-ring"],
] as const;

const toneRows: { tone: Tone; glyph: string; label: string }[] = [
  { tone: "css", glyph: "{ }", label: "CSS" },
  { tone: "html", glyph: "</>", label: "HTML" },
  { tone: "js", glyph: "JS", label: "JavaScript" },
  { tone: "ts", glyph: "TS", label: "TypeScript" },
  { tone: "correct", glyph: "✓", label: "Correct" },
  { tone: "incorrect", glyph: "✕", label: "Incorrect" },
  { tone: "brand", glyph: "+2", label: "Brand" },
  { tone: "streak", glyph: "4", label: "Streak" },
];

const typeScale = [
  [
    "text-hero",
    "font-display text-hero font-bold text-ink-primary",
    "Sharpen your frontend skills,",
  ],
  [
    "text-hero-compact",
    "font-display text-hero-compact font-bold text-ink-primary",
    "one question at a time.",
  ],
  [
    "text-lede",
    "text-lede text-ink-muted",
    "Junior interview drills in CSS, HTML, JavaScript and TypeScript.",
  ],
  [
    "text-lede-compact",
    "text-lede-compact text-ink-muted",
    "Ten questions per round. Under five minutes.",
  ],
  [
    "text-results",
    "font-display text-results font-bold text-ink-primary",
    "Strong round — you're interview-ready on closures.",
  ],
  [
    "text-question",
    "font-display text-question font-semibold text-ink-primary",
    "What does typeof null evaluate to?",
  ],
  [
    "text-question-compact",
    "font-display text-question-compact font-semibold text-ink-primary",
    "What does typeof null evaluate to?",
  ],
  ["text-score", "font-display text-score font-bold text-ink-primary", "7/10"],
  ["text-stat", "font-display text-stat font-bold text-ink-primary", "72"],
  [
    "text-section",
    "font-display text-section font-semibold text-ink-heading-alt",
    "Pick a topic",
  ],
  [
    "text-topic",
    "font-display text-topic font-semibold text-ink-primary",
    "JavaScript",
  ],
  [
    "text-topic-compact",
    "font-display text-topic-compact font-semibold text-ink-primary",
    "TypeScript",
  ],
  [
    "text-answer",
    "text-answer font-medium text-ink-secondary",
    'The string "object"',
  ],
  [
    "text-answer-compact",
    "text-answer-compact font-medium text-ink-secondary",
    "It throws a TypeError",
  ],
  [
    "text-figure",
    "font-display text-figure font-bold text-ink-heading-alt",
    "4:12",
  ],
  [
    "text-row",
    "text-row text-ink-secondary",
    "Which method removes the last array item?",
  ],
  [
    "text-brand",
    "font-display text-brand font-bold text-ink-primary",
    "Dev Interview Hub",
  ],
  ["text-meta", "text-meta text-ink-muted", "10 questions"],
  ["text-caption", "text-caption text-ink-faintest", "Last played 2 days ago"],
  [
    "text-eyebrow",
    "text-eyebrow font-semibold uppercase text-ink-faint",
    "Overall accuracy",
  ],
  [
    "text-eyebrow-compact",
    "font-mono text-eyebrow-compact uppercase text-ink-faint",
    "Your answer",
  ],
] as const;

const radii = [
  ["pill", "rounded-pill"],
  ["chip · 8", "rounded-chip"],
  ["code · 9", "rounded-code"],
  ["tile-sm · 10", "rounded-tile-sm"],
  ["tile-md · 11", "rounded-tile-md"],
  ["tile · 12", "rounded-tile"],
  ["control-sm · 14", "rounded-control-sm"],
  ["control · 15", "rounded-control"],
  ["control-lg · 16", "rounded-control-lg"],
  ["answer · 18", "rounded-answer"],
  ["row · 20", "rounded-row"],
  ["card · 22", "rounded-card"],
  ["hero · 26", "rounded-hero"],
  ["artboard · 30", "rounded-artboard"],
  ["phone · 38", "rounded-phone"],
] as const;

const shadows = [
  ["card", "shadow-card"],
  ["stat", "shadow-stat"],
  ["artboard", "shadow-artboard"],
  ["logo", "shadow-logo"],
  ["cta", "shadow-cta"],
  ["cta-next", "shadow-cta-next"],
  ["cta-compact", "shadow-cta-compact"],
  ["selected", "shadow-selected"],
  ["focus-card", "shadow-focus-card"],
  ["score-ring", "shadow-score-ring"],
  ["score-hero", "shadow-score-hero"],
  ["progress-glow", "shadow-progress-glow"],
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-mono text-eyebrow uppercase tracking-label text-ink-faint">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Specimen({
  label,
  pinned = false,
  className,
  children,
}: {
  label: string;
  pinned?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={cn("flex flex-col items-start gap-2", className)}>
      <div inert={pinned} className="contents">
        {children}
      </div>
      <figcaption className="font-mono text-caption text-ink-faint">
        {label}
      </figcaption>
    </figure>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("size-9 shrink-0 rounded-tile", className)} />
      <code className="font-mono text-caption text-ink-muted">{name}</code>
    </div>
  );
}

const SPECIMEN_PLAYED_AT = "2026-09-12T10:00:00.000Z";

function playedProgress(bestScore: number, lastScore: number): TopicProgress {
  return {
    bestScore,
    attempts: 3,
    lastScore,
    lastPlayedAt: SPECIMEN_PLAYED_AT,
  };
}

const untouchedProgress: TopicProgress = {
  bestScore: 0,
  attempts: 0,
  lastScore: null,
  lastPlayedAt: null,
};

export function TokenPanel({
  title,
  inverse = false,
}: {
  title: string;
  inverse?: boolean;
}) {
  const headingId = inverse ? "tokens-inverse" : "tokens-active";

  return (
    <Surface
      ambient="home"
      role="region"
      aria-labelledby={headingId}
      data-theme-scope={inverse ? "inverse" : undefined}
      className="min-w-0 overflow-hidden rounded-artboard border border-line text-ink-primary shadow-artboard"
    >
      <SiteHeader sticky={false} />

      <div className="flex flex-col gap-10 p-gutter-compact sm:p-gutter">
        <h2
          id={headingId}
          className="font-display text-section font-semibold text-ink-heading-alt"
        >
          {title}
        </h2>

        <Section title="Surface">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {surfaceSwatches.map(([name, className]) => (
              <Swatch
                key={name}
                name={name}
                className={cn("border border-line", className)}
              />
            ))}
            {lineSwatches.map(([name, className]) => (
              <Swatch
                key={name}
                name={name}
                className={cn("border-2", className)}
              />
            ))}
            <Swatch name="brand-gradient" className="bg-brand" />
            <Swatch name="cta-gradient" className="bg-cta" />
            <Swatch name="avatar-gradient" className="bg-avatar" />
            <Swatch name="scrim" className="border border-line bg-scrim" />
          </div>
        </Section>

        <Section title="Ink">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {inkSwatches.map(([name, className]) => (
              <div key={name} className="flex items-baseline gap-3">
                <span
                  className={cn(
                    "font-display text-figure font-bold",
                    className
                  )}
                >
                  Aa
                </span>
                <code className="font-mono text-caption text-ink-muted">
                  {name}
                </code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Accents">
          <div className="flex flex-col gap-3">
            {toneRows.map(({ tone, glyph, label }) => (
              <div
                key={tone}
                className={cn(
                  "flex flex-wrap items-center gap-4",
                  toneClasses[tone]
                )}
              >
                <TopicIconTile glyph={glyph} />
                <span className="h-1.5 w-20 rounded-pill bg-tone-solid" />
                <Badge tone={tone}>{label}</Badge>
                <span className="text-meta font-semibold text-tone-ink">
                  {label} ink
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Specimen label="selected answer">
              <div className="flex min-h-18.5 w-72 items-center gap-4.5 rounded-answer border-2 border-selected-line bg-selected-fill px-5.5 shadow-selected">
                <span className="text-answer font-medium text-ink-primary">
                  Option B
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto grid size-6.5 place-items-center rounded-pill bg-check text-nav font-bold text-on-check"
                >
                  ✓
                </span>
              </div>
            </Specimen>
            <Specimen label="code span">
              <code className="tone-js rounded-code border border-code-line bg-code-fill px-2.5 py-0.5 font-mono text-answer text-tone-ink">
                typeof null
              </code>
            </Specimen>
          </div>
        </Section>

        <Section title="Typography">
          <div className="flex flex-col gap-4">
            {typeScale.map(([token, className, sample]) => (
              <div key={token} className="flex flex-col gap-1">
                <code className="font-mono text-caption text-ink-faint">
                  {token}
                </code>
                <p className={className}>{sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Radii">
          <div className="flex flex-wrap gap-4">
            {radii.map(([name, className]) => (
              <Specimen key={name} label={name}>
                <span
                  className={cn(
                    "block size-16 border border-line-strong bg-glass-strong",
                    className
                  )}
                />
              </Specimen>
            ))}
          </div>
        </Section>

        <Section title="Elevation">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-x-5 gap-y-8">
            {shadows.map(([name, className]) => (
              <Specimen key={name} label={name} className="items-stretch">
                <span
                  className={cn(
                    "block h-16 rounded-card border border-line bg-glass",
                    className
                  )}
                />
              </Specimen>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Theme toggle">
          <div className="flex flex-wrap items-end gap-8">
            <Specimen label="live">
              <ThemeToggle />
            </Specimen>
            <Specimen label="hover" pinned>
              <ThemeToggle forceItemState="hover" />
            </Specimen>
            <Specimen label="focus" pinned>
              <ThemeToggle forceItemState="focus" />
            </Specimen>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-6">
            <Specimen label="primary · rest">
              <Button>Next question →</Button>
            </Specimen>
            <Specimen label="primary · hover" pinned>
              <Button data-force-state="hover">Next question →</Button>
            </Specimen>
            <Specimen label="primary · focus" pinned>
              <Button data-force-state="focus">Next question →</Button>
            </Specimen>
            <Specimen label="primary · disabled">
              <Button disabled>Next question →</Button>
            </Specimen>
          </div>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-6">
            <Specimen label="primary lg · rest">
              <Button size="lg">Retry quiz</Button>
            </Specimen>
            <Specimen label="primary lg · hover" pinned>
              <Button size="lg" data-force-state="hover">
                Retry quiz
              </Button>
            </Specimen>
            <Specimen label="secondary lg · rest">
              <Button variant="secondary" size="lg">
                Back to topics
              </Button>
            </Specimen>
            <Specimen label="secondary lg · hover" pinned>
              <Button variant="secondary" size="lg" data-force-state="hover">
                Back to topics
              </Button>
            </Specimen>
            <Specimen label="secondary lg · focus" pinned>
              <Button variant="secondary" size="lg" data-force-state="focus">
                Back to topics
              </Button>
            </Specimen>
            <Specimen label="secondary lg · disabled">
              <Button variant="secondary" size="lg" disabled>
                Back to topics
              </Button>
            </Specimen>
          </div>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-6">
            <Specimen
              label="compact pair · rest"
              className="w-full max-w-sm items-stretch"
            >
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="compact">
                  Skip
                </Button>
                <Button size="compact" className="flex-1">
                  Next question
                </Button>
              </div>
            </Specimen>
            <Specimen
              label="compact · disabled"
              className="w-full max-w-sm items-stretch"
            >
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="compact">
                  Skip
                </Button>
                <Button size="compact" className="flex-1" disabled>
                  Next question
                </Button>
              </div>
            </Specimen>
          </div>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-6">
            <Specimen label="ghost · rest">
              <Button variant="ghost" size="inline">
                Skip
              </Button>
            </Specimen>
            <Specimen label="ghost · hover" pinned>
              <Button variant="ghost" size="inline" data-force-state="hover">
                Skip
              </Button>
            </Specimen>
            <Specimen label="pill · rest">
              <Button variant="pill" size="pill">
                Exit round
              </Button>
            </Specimen>
            <Specimen label="pill · hover" pinned>
              <Button variant="pill" size="pill" data-force-state="hover">
                Exit round
              </Button>
            </Specimen>
          </div>
        </Section>

        <Section title="Glass cards">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-5">
            <Specimen label="glass · rest" className="items-stretch">
              <TopicCard
                topic={getTopic("css")}
                progress={playedProgress(10, 10)}
                status={{ kind: "played", daysAgo: 2 }}
              />
            </Specimen>
            <Specimen
              label="glass · hover (css)"
              pinned
              className="items-stretch"
            >
              <TopicCard
                topic={getTopic("css")}
                progress={playedProgress(10, 10)}
                status={{ kind: "played", daysAgo: 2 }}
                data-force-state="hover"
              />
            </Specimen>
            <Specimen
              label="glass · hover (html, review)"
              pinned
              className="items-stretch"
            >
              <TopicCard
                topic={getTopic("html")}
                progress={playedProgress(9, 9)}
                status={{ kind: "review", count: 1 }}
                data-force-state="hover"
              />
            </Specimen>
            <Specimen label="focus · rest" className="items-stretch">
              <TopicCard
                topic={getTopic("js")}
                progress={playedProgress(7, 7)}
                status={{ kind: "review", count: 3 }}
                focus
              />
            </Specimen>
            <Specimen label="focus · hover" pinned className="items-stretch">
              <TopicCard
                topic={getTopic("js")}
                progress={playedProgress(7, 7)}
                status={{ kind: "review", count: 3 }}
                focus
                data-force-state="hover"
              />
            </Specimen>
            <Specimen label="glass · not attempted" className="items-stretch">
              <TopicCard
                topic={getTopic("ts")}
                progress={untouchedProgress}
                status={{ kind: "new" }}
              />
            </Specimen>
            <Specimen label="stat" className="items-stretch">
              <Card variant="stat">
                <p className="text-eyebrow font-semibold uppercase text-ink-faint">
                  Overall accuracy
                </p>
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-stat font-bold text-ink-primary">
                    72
                  </span>
                  <span className="text-unit font-semibold text-ink-muted">
                    %
                  </span>
                </p>
                <Progress
                  value={72}
                  size="md"
                  track="strong"
                  fill="sweep"
                  aria-label="Overall accuracy"
                />
                <p className="text-meta text-ink-muted">
                  29 of 40 questions mastered
                </p>
              </Card>
            </Specimen>
          </div>
        </Section>

        <Section title="Progress">
          <div className="flex flex-col gap-5">
            <Specimen
              label="xs · tone (css 80%)"
              className="items-stretch tone-css"
            >
              <Progress
                value={80}
                size="xs"
                track="strong"
                aria-label="CSS best score"
              />
            </Specimen>
            {(
              [
                ["css", 80],
                ["html", 90],
                ["js", 70],
                ["ts", 0],
              ] as const
            ).map(([tone, value]) => (
              <Specimen
                key={tone}
                label={`sm · tone (${tone} ${value}%)`}
                className={cn("items-stretch", toneClasses[tone])}
              >
                <Progress value={value} aria-label={`${tone} best score`} />
              </Specimen>
            ))}
            <Specimen label="md · sweep (72%)" className="items-stretch">
              <Progress
                value={72}
                size="md"
                track="strong"
                fill="sweep"
                aria-label="Overall accuracy"
              />
            </Specimen>
            <Specimen label="lg · quiz (30%)" className="items-stretch">
              <Progress
                value={30}
                size="lg"
                track="strong"
                fill="quiz"
                aria-label="Question 3 of 10"
              />
            </Specimen>
            <Specimen label="xl · quiz (30%)" className="items-stretch">
              <Progress
                value={30}
                size="xl"
                track="strong"
                fill="quiz"
                aria-label="Question 3 of 10"
              />
            </Specimen>
          </div>
        </Section>

        <Section title="Pills">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="css">Best: 8/10</Badge>
            <Badge tone="html">Best: 9/10</Badge>
            <Badge tone="js">Best: 7/10</Badge>
            <Badge tone="neutral">Not attempted yet</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="css" size="xs">
              8/10
            </Badge>
            <Badge tone="html" size="xs">
              9/10
            </Badge>
            <Badge tone="js" size="xs">
              7/10
            </Badge>
            <Badge tone="neutral" size="xs">
              New
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="streak" size="md" dot className="tracking-streak">
              4-day streak
            </Badge>
            <Badge tone="correct" size="md" emphasis="strong">
              New personal best
            </Badge>
            <Badge tone="brand" size="md">
              +2 vs last round
            </Badge>
            <Badge tone="glass" size="chip">
              Single choice
            </Badge>
          </div>
        </Section>

        <Section title="Surfaces">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
            {(["home", "quiz", "results"] as const).map((ambient) => (
              <Surface
                key={ambient}
                ambient={ambient}
                className="h-32 overflow-hidden rounded-card border border-line p-4"
              >
                <code className="font-mono text-caption text-ink-faint">
                  ambient-{ambient}
                </code>
              </Surface>
            ))}
          </div>
        </Section>
      </div>
    </Surface>
  );
}
