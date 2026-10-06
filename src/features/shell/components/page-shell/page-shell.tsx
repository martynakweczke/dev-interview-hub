import type { ComponentProps } from "react";

import { Surface } from "@/components/surface/surface";
import { SiteHeader } from "@/features/shell/components/site-header/site-header";

type PageShellProps = ComponentProps<typeof Surface> & {
  showThemeToggle?: boolean;
};

export function PageShell({
  ambient,
  showThemeToggle,
  children,
  ...props
}: PageShellProps) {
  return (
    <Surface ambient={ambient} className="flex min-h-dvh flex-col" {...props}>
      <SiteHeader showThemeToggle={showThemeToggle} />
      {children}
    </Surface>
  );
}
