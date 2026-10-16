"use client";

import { useUser } from "@clerk/nextjs";

import { SignInLink } from "@/features/auth/components/sign-in-link/sign-in-link";
import { UserMenu } from "@/features/auth/components/user-menu/user-menu";
import { isAdmin } from "@/features/auth/services/admin-role/admin-role";
import {
  getDisplayName,
  getInitials,
  type DisplayUser,
} from "@/features/auth/services/user-display/user-display";
import { cn } from "@/utils/cn/cn.utils";

export function AuthControls({ className }: { className?: string }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block size-10.5 rounded-pill border border-line-subtle bg-glass-strong",
          className
        )}
      />
    );
  }

  if (!isSignedIn) {
    return <SignInLink className={className} />;
  }

  const displayUser: DisplayUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.primaryEmailAddress?.emailAddress ?? null,
  };

  return (
    <UserMenu
      name={getDisplayName(displayUser)}
      initials={getInitials(displayUser)}
      email={displayUser.email}
      imageUrl={user.hasImage ? user.imageUrl : null}
      showAdminLink={isAdmin({ metadata: user.publicMetadata })}
      className={className}
    />
  );
}
