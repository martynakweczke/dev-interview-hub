import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/utils/cn/cn.utils";

export function ShortcutHint({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-caption text-ink-faint max-sm:hidden",
        className
      )}
    >
      <KbdGroup>
        <Kbd>A</Kbd>–<Kbd>D</Kbd>
      </KbdGroup>
      or
      <KbdGroup>
        <Kbd>1</Kbd>–<Kbd>4</Kbd>
      </KbdGroup>
      to pick ·<Kbd>Enter</Kbd>
      to continue
    </p>
  );
}
