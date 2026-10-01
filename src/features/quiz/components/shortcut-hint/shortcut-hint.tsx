import { cn } from "@/utils/cn/cn.utils";

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-chip border border-line-strong bg-neutral-fill px-1.5 py-0.5 font-mono text-caption text-ink-tertiary">
      {children}
    </kbd>
  );
}

export function ShortcutHint({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-caption text-ink-faint max-sm:hidden",
        className
      )}
    >
      <Key>A</Key>–<Key>D</Key> or <Key>1</Key>–<Key>4</Key> to pick ·{" "}
      <Key>Enter</Key> to continue
    </p>
  );
}
