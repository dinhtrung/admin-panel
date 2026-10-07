/** Appearance control: system, light, dark — a real radio group, not three icon buttons that lie
 *  about their state. */

import { useEffect, useState } from "react";
import { applyAppearance, readAppearance, watchSystemAppearance, writeAppearance, type Appearance } from "../lib/appearance";
import { cn } from "../lib/cn";

const OPTIONS: { value: Appearance; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function AppearanceControl({
  compact = false,
  tone = "rail",
}: {
  compact?: boolean;
  tone?: "rail" | "panel";
}) {
  const [choice, setChoice] = useState<Appearance>(() => (typeof window === "undefined" ? "system" : readAppearance()));

  useEffect(() => {
    applyAppearance(choice);
  }, [choice]);

  useEffect(() => watchSystemAppearance(() => setChoice(readAppearance())), []);

  // The control is drawn on the rail in the shell and on a panel in Settings, so its colours come
  // from the surface it sits on rather than from one hard-coded tone.
  const frame = tone === "rail" ? "border-rail-ink/30" : "border-rule-strong";
  const selected = tone === "rail" ? "bg-rail-ink text-rail" : "bg-plum text-on-plum";
  const idle = tone === "rail" ? "text-rail-ink/75 hover:text-rail-ink" : "text-ink-muted hover:text-ink";

  return (
    <div role="radiogroup" aria-label="Appearance" className={cn("inline-flex border", frame, compact ? "w-full" : "")}>
      {OPTIONS.map((option) => {
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
              "relative flex-1 px-2 py-1 text-[0.6875rem] font-semibold transition-colors after:absolute after:-inset-y-1 after:content-['']",
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
