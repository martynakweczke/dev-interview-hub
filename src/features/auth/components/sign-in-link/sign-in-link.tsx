import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SignInLink({ className }: { className?: string }) {
  return (
    <Button asChild variant="pill" size="pill" className={className}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
