"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn/cn.utils";

const navLinkVariants = cva(
  "relative rounded-chip text-nav-compact transition-colors duration-160 ease-ui after:absolute after:-inset-x-2 after:-inset-y-3.5 sm:text-nav",
  {
    variants: {
      emphasis: {
        default: "font-medium text-ink-tertiary hovered:text-ink-primary",
        accent: "font-semibold text-accent-link hovered:text-accent-link-hover",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  }
);

type NavLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof navLinkVariants>;

export function NavLink({ href, emphasis, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = typeof href === "string" && pathname === href;

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(navLinkVariants({ emphasis }), className)}
      {...props}
    />
  );
}
