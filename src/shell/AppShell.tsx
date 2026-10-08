/** The shell: a full-width top band and the board, with nothing between them.
 *
 *  The trial's change: navigation leaves the rail and moves into the band (see TopBand), so the board
 *  owns the whole width of the window and the table is the first thing the eye reaches. The band is
 *  the palette's one saturated region now, and it carries the rail's focus rule with it.
 *
 *  The shell no longer lays out a grid column, so a screen's own container decides its gutters — a
 *  list board runs edge to edge, a form or dashboard still sets its own measure. */

import type { ReactNode } from "react";
import { TopBand } from "./TopBand";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:border focus:border-rule-strong focus:bg-panel focus:px-3 focus:py-1.5 focus:text-body focus:text-ink"
      >
        Skip to the board
      </a>

      <TopBand />

      <main id="main" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
        {children}
      </main>

      <footer className="border-t border-rule px-3 py-2 text-[0.6875rem] text-ink-muted sm:px-5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Synthetic demo board · every name, organization and event is authored · not a real service</span>
          <span aria-hidden="true">·</span>
          <a href="/LICENSE.txt" className="underline decoration-rule-strong hover:text-ink">
            MIT licensed
          </a>
        </span>
      </footer>
    </div>
  );
}
