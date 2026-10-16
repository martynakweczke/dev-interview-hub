import type { ComponentProps } from "react";

import { cn } from "@/utils/cn/cn.utils";

const fieldClasses =
  "w-full min-w-0 rounded-control border border-line-strong bg-glass-strong px-4 py-3 text-row text-ink-primary transition-colors duration-160 ease-ui placeholder:text-ink-faint enabled:hovered:bg-glass-hover disabled:cursor-not-allowed disabled:text-ink-disabled aria-invalid:tone-incorrect aria-invalid:border-tone-line";

function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(fieldClasses, className)}
      {...props}
    />
  );
}

export { fieldClasses, Input };
