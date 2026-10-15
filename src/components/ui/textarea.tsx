import type { ComponentProps } from "react";

import { fieldClasses } from "@/components/ui/input";
import { cn } from "@/utils/cn/cn.utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClasses, "min-h-24 resize-y", className)}
      {...props}
    />
  );
}

export { Textarea };
