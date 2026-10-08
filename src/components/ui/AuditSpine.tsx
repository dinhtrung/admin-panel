/** The audit spine: a record's own history, ruled and weighted by elapsed time.
 *
 *  A flat list of events answers "what happened"; it does not answer "how busy was this record, and
 *  when". So the vertical gap between two consecutive events is proportional to the time between
 *  them: a quiet quarter leaves a visibly long gap and a burst sits tight. That makes the shape of the
 *  record readable without a chart and without leaving the record.
 *
 *  The gap is a second reading of something each line already states — every entry prints its own
 *  date — so nothing here is carried by geometry alone, and the spine is a `<ol>` of real text for a
 *  screen reader rather than a decoration. */

import type { AuditEvent } from "../../mock/types";
import { dateTime, relativeTime } from "../../lib/format";

/** Gap bounds in rem. The floor keeps two same-hour events from colliding; the ceiling stops a
 *  dormant year from turning one gap into a screen of white. */
const MIN_GAP_REM = 0.5;
const MAX_GAP_REM = 3.5;

function gapFor(elapsedMs: number, spanMs: number): number {
  if (spanMs <= 0) return MIN_GAP_REM;
  const share = Math.max(0, Math.min(1, elapsedMs / spanMs));
  return MIN_GAP_REM + share * (MAX_GAP_REM - MIN_GAP_REM);
}

export function AuditSpine({ events, title = "Audit spine" }: { events: AuditEvent[]; title?: string }) {
  if (events.length === 0) {
    return (
      <section aria-label={title}>
        <h3 className="text-label text-ink-muted">{title}</h3>
        <p className="mt-2 text-[0.6875rem] text-ink-muted">
          Nothing has happened to this record yet, so it has no spine. The first change will draw it.
        </p>
      </section>
    );
  }

  // Events arrive newest-first; the spine reads oldest at the top, the way a record is written.
  const ordered = [...events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const times = ordered.map((event) => Date.parse(event.at));
  const gaps = ordered.slice(1).map((_, i) => times[i + 1]! - times[i]!);
  const span = gaps.length > 0 ? Math.max(...gaps) : 0;

  return (
    <section aria-label={title}>
      <h3 className="text-label text-ink-muted">{title}</h3>
      <p className="mt-1 text-[0.6875rem] text-ink-muted">
        Oldest first. The space between entries is the time between them, so a quiet stretch draws a
        longer gap.
      </p>
      <ol className="mt-2 border-l border-rule pl-3">
        {ordered.map((event, index) => {
          const gap = index === 0 ? MIN_GAP_REM : gapFor(gaps[index - 1]!, span);
          return (
            <li
              key={event.id}
              className="relative"
              style={index === 0 ? undefined : { paddingTop: `${gap}rem` }}
            >
              {/* The tick that joins each entry to the rule: the spine is drawn, not implied. */}
              <span
                aria-hidden="true"
                className="absolute top-[0.45rem] -left-[calc(0.75rem+1px)] h-px w-2.5 bg-rule-strong"
              />
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-[0.6875rem] font-semibold text-ink">{event.action}</span>
                <span className="num ml-auto text-[0.6875rem] text-ink-muted" title={dateTime(event.at)}>
                  {relativeTime(event.at)}
                </span>
              </span>
              <span className="block text-[0.6875rem] text-ink-muted">
                {event.actorName} · {event.targetLabel}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
