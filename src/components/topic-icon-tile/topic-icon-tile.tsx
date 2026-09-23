import { cva } from "class-variance-authority";

import { toneClasses, type Tone } from "@/lib/tones/tones";
import { cn } from "@/utils/cn/cn.utils";

const topicIconTileVariants = cva(
  "grid size-12 shrink-0 place-items-center rounded-control-sm border border-tone-tile-line bg-tone-tile-fill font-mono font-bold text-tone-ink sm:size-12.5 sm:rounded-icon",
  {
    variants: {
      glyphWidth: {
        narrow: "text-glyph-sm sm:text-glyph",
        wide: "text-glyph-xs sm:text-glyph-sm",
      },
    },
  }
);

type TopicIconTileProps = {
  glyph: string;
  tone?: Tone;
  className?: string;
};

export function TopicIconTile({ glyph, tone, className }: TopicIconTileProps) {
  const glyphWidth = glyph.replace(/\s/g, "").length > 2 ? "wide" : "narrow";

  return (
    <span
      aria-hidden="true"
      className={cn(
        topicIconTileVariants({ glyphWidth }),
        tone && toneClasses[tone],
        className
      )}
    >
      {glyph}
    </span>
  );
}
