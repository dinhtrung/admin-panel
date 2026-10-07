/** Appearance control: the machine's preference plus every registered appearance — a real radio
 *  group, not four icon buttons that lie about their state. The list comes from the registry, so a
 *  new appearance appears here without this file changing. */

import { useEffect, useState } from "react";
import {
  APPEARANCES,
  applyAppearance,
  readAppearance,
  watchSystemAppearance,
  writeAppearance,
  type AppearanceChoice,
} from "../lib/appearance";
import { cn } from "../lib/cn";

export function AppearanceControl({
  compact = false,
  tone = "rail",
}: {
  compact?: boolean;
  tone?: "rail" | "panel";
}) {
  const [choice, setChoice] = useState<AppearanceChoice>(() =>
    typeof window === "undefined" ? "system" : readAppearance(),
  );

  useEffect(() => {
    applyAppearance(choice);
  }, [choice]);

  useEffect(() => watchSystemAppearance(() => setChoice(readAppearance())), []);

  // The control is drawn on the rail in the shell and on a panel in Settings, so its colours come
  // from the surface it sits on rather than from one hard-coded tone.
  const frame = tone === "rail" ? "border-rail-ink/30" : "border-rule-strong";
  const selected = tone === "rail" ? "bg-rail-ink text-rail" : "bg-plum text-on-plum";
  const idle = tone === "rail" ? "text-rail-ink/75 hover:text-rail-ink" : "text-ink-muted hover:text-ink";

  const options: { value: AppearanceChoice; label: string }[] = [
    { value: "system", label: "System" },
    ...APPEARANCES.map((appearance) => ({ value: appearance.id, label: appearance.label })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className={cn("inline-flex flex-wrap border", frame, compact ? "w-full" : "")}
    >
      {options.map((option) => {
        const isSelected = choice === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => {
              setChoice(option.value);
              writeAppearance(option.value);
            }}
            className={cn(
              "relative min-w-[4.25rem] flex-1 px-2 py-1 text-[0.6875rem] font-semibold transition-colors after:absolute after:-inset-y-1 after:content-['']",
              isSelected ? selected : idle,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
