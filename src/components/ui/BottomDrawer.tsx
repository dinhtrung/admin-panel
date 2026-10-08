/** The record drawer: a record opens across the bottom edge, never beside the board and never as a
 *  modal on a wide screen.
 *
 *  The reason the pattern exists is the same one the side panel had — the operator edits a record
 *  while watching the directory it belongs to — but the region differs: a record is wide (its history
 *  runs beside its fields), so it takes the width of the board rather than the height of a column.
 *  The drawer therefore leaves the table visible above it and stays **non-modal** at desktop sizes:
 *  no backdrop, no focus trap. Below the narrow breakpoint there is no "above", so it becomes a modal
 *  sheet and contains focus.
 *
 *  Either way: focus moves into the drawer on open, Escape dismisses it, and focus returns to the
 *  control that opened it. */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconButton } from "./Button";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useNarrow(breakpoint = 640): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const listener = () => setNarrow(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);
  return narrow;
}

export interface BottomDrawerProps {
  open: boolean;
  onClose: () => void;
  /** The record's name — the drawer's accessible title. */
  title: string;
  /** Identity line under the title: an address, a code, a state. */
  meta?: ReactNode;
  children: ReactNode;
  /** The signature region: the record's own history, ruled and time-weighted. */
  spine?: ReactNode;
  /** A record whose own content opens with its identity (a name, a code, a state) draws its own head:
   *  the drawer keeps the accessible name but paints no header row, so the name is not stated twice.
   *  The dismiss control then floats at the top-right corner. */
  headless?: boolean;
  /** Whether the drawer supplies the body's gutters. A record whose own screen already draws them
   *  passes false, so the drawer does not indent a page that indents itself. */
  padded?: boolean;
  onBeforeClose?: () => boolean;
}

export function BottomDrawer({
  open,
  onClose,
  title,
  meta,
  children,
  spine,
  headless = false,
  padded = true,
  onBeforeClose,
}: BottomDrawerProps) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const narrow = useNarrow();

  const requestClose = useCallback(() => {
    if (onBeforeClose && onBeforeClose() === false) return;
    onClose();
  }, [onBeforeClose, onClose]);

  // Focus enters on open and returns to the trigger on close, in both modes.
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel.current)?.focus();
    return () => {
      if (restoreTo.current && document.contains(restoreTo.current)) restoreTo.current.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        requestClose();
        return;
      }
      // Focus is contained only in the modal (narrow) presentation.
      if (!narrow || event.key !== "Tab") return;
      const node = panel.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, narrow, requestClose]);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col justify-end", narrow ? "" : "pointer-events-none")}>
      {narrow ? (
        <div
          className="pointer-events-auto absolute inset-0 bg-[color-mix(in_srgb,var(--palette-ink)_55%,transparent)]"
          onClick={requestClose}
          aria-hidden="true"
        />
      ) : null}
      <div
        ref={panel}
        role="dialog"
        aria-modal={narrow ? true : undefined}
        aria-labelledby="record-drawer-title"
        tabIndex={-1}
        className={cn(
          "pointer-events-auto relative flex flex-col border-t border-rule-strong bg-panel shadow-overlay",
          // The record region is bounded so the board above it stays readable: a little under half
          // the viewport on a wide screen, most of it when the drawer is the only surface left.
          narrow ? "h-[92svh]" : "max-h-[46svh]",
          "motion-safe:animate-[drawer-in_240ms_cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute top-1.5 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-chip bg-rule-strong"
        />
        {headless ? (
          <>
            <h2 id="record-drawer-title" className="sr-only">
              {title}
            </h2>
            <IconButton label="Close record" onClick={requestClose} className="absolute top-2 right-3 z-10">
              <X size={14} />
            </IconButton>
          </>
        ) : (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rule px-3 pt-4 pb-2 sm:px-5">
            <h2 id="record-drawer-title" className="text-title font-semibold tracking-[-0.015em] text-ink">
              {title}
            </h2>
            {meta ? <p className="text-[0.6875rem] text-ink-muted">{meta}</p> : null}
            <IconButton label="Close record" onClick={requestClose} className="ml-auto shrink-0">
              <X size={14} />
            </IconButton>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto", padded && "px-3 py-3 sm:px-5")}>
            {children}
          </div>
          {spine ? (
            <div className="min-h-0 shrink-0 overflow-y-auto border-t border-rule px-3 py-3 sm:px-5 lg:w-[26rem] lg:border-t-0 lg:border-l">
              {spine}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
