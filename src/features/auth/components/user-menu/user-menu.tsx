"use client";

import type { ComponentProps } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn/cn.utils";

type UserMenuProps = Omit<
  ComponentProps<typeof DropdownMenuTrigger>,
  "children"
> & {
  name: string;
  initials: string;
  email: string | null;
  imageUrl?: string | null;
};

export function UserMenu({
  name,
  initials,
  email,
  imageUrl,
  className,
  ...props
}: UserMenuProps) {
  const { signOut } = useClerk();

  function handleSignOut() {
    void signOut({ redirectUrl: window.location.pathname });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${name}`}
        className={cn(
          "flex items-center gap-2.5 rounded-pill border border-line-subtle bg-glass-strong p-1.5 transition-colors duration-160 ease-ui hovered:bg-glass-hover min-[50rem]:pr-3.5",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center overflow-hidden rounded-pill bg-avatar text-avatar font-bold text-on-avatar"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              width={28}
              height={28}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
        <span className="hidden max-w-28 truncate text-nav-compact font-medium text-ink-secondary min-[50rem]:inline">
          {name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Signed in as
          <span className="block truncate text-nav-compact font-medium text-ink-primary">
            {email ?? name}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut aria-hidden="true" className="size-3.5" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
