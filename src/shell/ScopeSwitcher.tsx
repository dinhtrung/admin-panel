/** The scope switcher: whose board is this. One control, and every count on every screen follows it. */

import { useQuery } from "@tanstack/react-query";
import { listOrganizations } from "../mock/api";
import { cn } from "../lib/cn";
import { useScope } from "./scope";

export function ScopeSwitcher({
  variant = "rail",
  showLabel = true,
}: {
  variant?: "rail" | "page";
  /** The band hides the word: the select states the scope, and the label would cost ~48px of a row
   *  that has to carry the navigation too. The accessible name stays — the label element still wraps
   *  the control. */
  showLabel?: boolean;
}) {
  const { orgId, setOrgId } = useScope();
  const { data } = useQuery({ queryKey: ["organizations", "scope"], queryFn: () => listOrganizations({ pageSize: 50 }) });
  const organizations = data?.items ?? [];

  return (
    <label className="flex items-center gap-2">
      <span
        className={cn(
          variant === "rail" ? "label text-rail-ink/70" : "label text-ink-muted",
          !showLabel && "sr-only",
        )}
      >
        Scope
      </span>
      <select
        value={orgId ?? ""}
        onChange={(e) => setOrgId(e.target.value || null)}
        className={
          variant === "rail"
            ? "min-h-7 max-w-[11rem] truncate rounded-chip border border-rail-ink/30 bg-rail px-1.5 text-[0.6875rem] font-semibold text-rail-ink"
            : "min-h-8 max-w-[14rem] truncate rounded-chip border border-rule-strong bg-panel px-1.5 text-body text-ink"
        }
      >
        <option value="">Whole board</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </label>
  );
}
