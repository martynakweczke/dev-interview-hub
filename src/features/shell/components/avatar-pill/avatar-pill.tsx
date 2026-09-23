import { learner } from "@/lib/profile/profile";
import { cn } from "@/utils/cn/cn.utils";

export function AvatarPill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-pill border border-line-subtle bg-glass-strong py-1.5 pr-3.5 pl-1.5",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-pill bg-avatar text-avatar font-bold text-on-avatar"
      >
        {learner.initials}
      </span>
      <span className="text-nav-compact font-medium text-ink-secondary">
        {learner.name}
      </span>
    </div>
  );
}
