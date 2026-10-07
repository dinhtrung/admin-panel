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

export function AppearanceControl({ compact = false }: { compact?: boolean }) {
  const [choice, setChoice] = useState<Appearance>(() => (typeof window === "undefined" ? "system" : readAppearance()));

  useEffect(() => {
    applyAppearance(choice);
  }, [choice]);

  useEffect(() => watchSystemAppearance(() => setChoice(readAppearance())), []);

  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className={cn("inline-flex border border-rail-ink/30", compact ? "w-full" : "")}
    >
      {OPTIONS.map((option) => {
        const selected = choice === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              setChoice(option.value);
              writeAppearance(option.value);
            }}
            className={cn(
              "relative flex-1 px-2 py-1 text-[0.6875rem] font-semibold transition-colors after:absolute after:-inset-y-1 after:content-['']",
              selected ? "bg-rail-ink text-rail" : "text-rail-ink/75 hover:text-rail-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
