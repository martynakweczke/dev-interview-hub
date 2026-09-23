import * as React from "react";

import { SiteHeader } from "@/features/shell/components/site-header/site-header";
import { Surface } from "@/components/surface/surface";

type PageShellProps = React.ComponentProps<typeof Surface> & {
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
