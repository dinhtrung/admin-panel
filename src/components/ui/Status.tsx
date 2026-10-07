/** The signature move: a magnet.
 *
 *  Status is a fixed-size, fixed-slot token that carries a three-letter code, a fill weight and a
 *  hue — so state survives greyscale, colour blindness and a screenshot. The tooltip and the
 *  accessible name always carry the word. */

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

const STATUS: Record<string, { code: string; word: string; className: string }> = {
  active: { code: "ACT", word: "Active", className: "bg-plum text-on-plum" },
  invited: { code: "INV", word: "Invited", className: "bg-selected text-ink-muted" },
  suspended: { code: "SUS", word: "Suspended", className: "bg-attention text-on-attention" },
  deactivated: { code: "DEA", word: "Deactivated", className: "border border-rule-strong text-ink-muted" },
  trial: { code: "TRL", word: "Trial", className: "border border-rule-strong text-ink-muted" },
  past_due: { code: "DUE", word: "Past due", className: "bg-attention text-on-attention" },
  owner: { code: "OWN", word: "Owner", className: "bg-plum text-on-plum" },
  admin: { code: "ADM", word: "Admin", className: "border border-rule-strong text-ink" },
  member: { code: "MEM", word: "Member", className: "border border-rule text-ink-muted" },
  revoked: { code: "REV", word: "Revoked", className: "border border-rule-strong text-ink-muted" },
};

export function StatusMagnet({
  status,
  className,
  title,
}: {
  status: string;
  className?: string;
  title?: string;
}) {
  const def = STATUS[status] ?? { code: status.slice(0, 3).toUpperCase(), word: status, className: "border border-rule text-ink-muted" };
  return (
    <span className={cn("magnet", def.className, className)} title={title ?? def.word} aria-label={def.word}>
      <span aria-hidden="true">{def.code}</span>
      <span className="sr-only">{def.word}</span>
    </span>
  );
}

/** Everything that is a chip but not a state: counts, plans, tags. Deliberately quieter than a
 *  magnet, so the state column stays the loudest thing on a row. */
export function Badge({
  children,
  tone = "quiet",
  className,
  mono = false,
}: {
  children: ReactNode;
  tone?: "quiet" | "ink" | "tint";
  className?: string;
  mono?: boolean;
}) {
  const tones = {
    quiet: "border border-rule text-ink-muted",
    ink: "bg-ink text-ground",
    tint: "bg-selected text-ink-muted",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-1.5 py-0.5 text-[0.6875rem] font-semibold",
        mono && "font-mono tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A count that has a direction. The arrow is drawn, not typed, and the number is always shown. */
export function Delta({ value, label }: { value: number; label: string }) {
  const tone = value === 0 ? "text-ink-muted" : "text-ink";
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.6875rem]", tone)}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="shrink-0">
        {value === 0 ? (
          <path d="M1.5 5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        ) : value > 0 ? (
          <path d="M5 1.5 8.5 7H1.5z" fill="currentColor" />
        ) : (
          <path d="M5 8.5 1.5 3h7z" fill="currentColor" />
        )}
      </svg>
      <span className="num">
        {value > 0 ? "+" : value < 0 ? "−" : ""}
        {Math.abs(value)}
      </span>
      <span className="text-ink-muted">{label}</span>
    </span>
  );
}
