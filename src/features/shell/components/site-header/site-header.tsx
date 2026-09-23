import Link from "next/link";

import { AvatarPill } from "@/features/shell/components/avatar-pill/avatar-pill";
import { LogoTile } from "@/features/shell/components/logo-tile/logo-tile";
import { NavLink } from "@/features/shell/components/nav-link/nav-link";
import { ThemeToggle } from "@/features/theme/components/theme-toggle/theme-toggle";
import { cn } from "@/utils/cn/cn.utils";

type SiteHeaderProps = {
  showThemeToggle?: boolean;
  sticky?: boolean;
  className?: string;
};

export function SiteHeader({
  showThemeToggle = true,
  sticky = true,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "z-10 border-b border-line-header backdrop-blur-header",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-gutter-compact pt-4.5 pb-3.5 sm:px-gutter sm:py-5.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-tile sm:gap-3"
        >
          <LogoTile />
          <span className="font-display text-brand-compact font-bold whitespace-nowrap text-ink-primary sm:text-brand">
            Dev Interview Hub
          </span>
        </Link>

        <div className="flex items-center gap-3.5 sm:gap-6.5">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6.5">
              <li className="hidden min-[42rem]:block">
                <NavLink href="/">Topics</NavLink>
              </li>
              <li>
                <NavLink href="/progress" emphasis="accent">
                  Progress
                </NavLink>
              </li>
            </ul>
          </nav>
          {showThemeToggle && <ThemeToggle />}
          <AvatarPill className="hidden min-[42rem]:flex" />
        </div>
      </div>
    </header>
  );
}
