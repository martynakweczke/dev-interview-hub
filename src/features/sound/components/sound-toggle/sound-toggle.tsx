"use client";

import { Volume2, VolumeX } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { useSound } from "@/features/sound/hooks/use-sound/use-sound";
import { playSelectSound } from "@/features/sound/services/sound-player/sound-player";
import { cn } from "@/utils/cn/cn.utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, setEnabled } = useSound();
  const Icon = enabled ? Volume2 : VolumeX;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-pill border border-line bg-glass-strong p-0.75",
        className
      )}
    >
      <Toggle
        aria-label="Answer sounds"
        pressed={enabled}
        onPressedChange={(next) => {
          setEnabled(next);
          playSelectSound();
        }}
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </Toggle>
    </span>
  );
}
