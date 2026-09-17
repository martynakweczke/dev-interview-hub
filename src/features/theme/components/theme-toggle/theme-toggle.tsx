"use client"

import { useTheme } from "@/features/theme/hooks/use-theme/use-theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ResolvedTheme } from "@/features/theme/services/theme/theme"

const OPTIONS: { value: ResolvedTheme; label: string; glyph: string }[] = [
  { value: "dark", label: "Dark theme", glyph: "☾" },
  { value: "light", label: "Light theme", glyph: "☀" },
]

type ThemeToggleProps = {
  className?: string
  forceItemState?: "hover" | "focus"
}


export function ThemeToggle({ className, forceItemState }: ThemeToggleProps) {
  const { snapshot, setPreference } = useTheme()

  return (
    <ToggleGroup
      type="single"
      variant="theme"
      aria-label={
        snapshot?.preference === "system"
          ? "Theme (following system setting)"
          : "Theme"
      }
      value={snapshot?.resolved ?? ""}
      onValueChange={(value) =>
        setPreference(value === "dark" || value === "light" ? value : "system")
      }
      className={className}
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          data-theme-option={option.value}
          data-force-state={forceItemState}
        >
          <span aria-hidden="true">{option.glyph}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
