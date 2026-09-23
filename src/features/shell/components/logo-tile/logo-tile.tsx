import { cn } from "@/utils/cn/cn.utils";

export function LogoTile({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-tile-sm bg-brand font-mono text-logo-compact font-bold text-on-logo sm:size-9.5 sm:rounded-tile sm:text-logo sm:shadow-logo",
        className
      )}
    >
      {"</>"}
    </span>
  );
}
