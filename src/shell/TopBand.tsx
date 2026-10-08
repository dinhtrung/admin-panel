/** The top band: the whole width of the board carries the wordmark, the navigation, the board's
 *  search and the controls.
 *
 *  This is the trial's first change. The incumbent shell keeps navigation in a 15rem rail, which
 *  costs every screen a column and makes the table the second thing the eye reaches. Here the
 *  saturated region moves to a band across the top, the board gets the full width, and the navigation
 *  is one flat run of links rather than five labelled groups.
 *
 *  The band is still the palette's one saturated region, so it carries the same obligations the rail
 *  had: `data-rail-surface` re-points the focus ring at the tint (the attention plum measures 2.44:1
 *  on ink), and everything on it is drawn in `rail-ink`. Below the large breakpoint a flat run cannot
 *  fit, so the navigation becomes an overlay sheet and the board keeps its own search in its toolbar. */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu as MenuIcon, Search, X } from "lucide-react";
import { useAuth } from "../auth/session";
import { useAccess } from "../access/access";
import { cn } from "../lib/cn";
import { initials } from "../lib/format";
import { IconButton } from "../components/ui";
import { AppearanceControl } from "./AppearanceControl";
import { BoardControls } from "./BoardControls";
import { ScopeSwitcher } from "./ScopeSwitcher";

interface NavItem {
  to: string;
  label: string;
  permission: string;
}

const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Board", items: [{ to: "/", label: "Overview", permission: "dashboard.read" }] },
  {
    group: "People",
    items: [
      { to: "/users", label: "Users", permission: "users.read" },
      { to: "/roles", label: "Roles", permission: "roles.read" },
    ],
  },
  {
    group: "Access",
    items: [
      { to: "/organizations", label: "Organizations", permission: "orgs.read" },
      { to: "/api-keys", label: "API keys", permission: "apikeys.read" },
    ],
  },
  {
    group: "Security",
    items: [
      { to: "/sessions", label: "Sessions", permission: "sessions.read" },
      { to: "/audit", label: "Audit record", permission: "audit.read" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { to: "/feature-flags", label: "Feature flags", permission: "flags.read" },
      { to: "/settings", label: "Settings", permission: "settings.write" },
    ],
  },
];

/** Boards whose list state carries a `q` in the address, and what to call them in the field. */
const SEARCHABLE: Record<string, string> = {
  "/users": "Search people",
  "/roles": "Search roles",
  "/organizations": "Search organizations",
  "/api-keys": "Search keys",
  "/sessions": "Search sessions",
  "/audit": "Search the audit record",
  "/feature-flags": "Search flags",
};

/** The board a path belongs to: `/users/usr_014` is still the users board, so a record address keeps
 *  the field rather than silently dropping it. Longest prefix wins, so `/api-keys` cannot be shadowed
 *  by a shorter key. */
function boardOf(pathname: string): string | undefined {
  const keys = Object.keys(SEARCHABLE).filter(
    (key) => pathname === key || pathname.startsWith(`${key}/`),
  );
  return keys.sort((a, b) => b.length - a.length)[0];
}

function isActive(item: NavItem, pathname: string): boolean {
  return item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/** The board's search, moved up into the band.
 *
 *  It is one field with one meaning: it writes `q` into this address, which is exactly what the
 *  list's own toolbar field writes. The list reads its state from the address on a `popstate`, so the
 *  write is announced the same way a back/forward step is — which is what makes this a control that
 *  does something rather than a decorative box. A board that has no `q` in its address gets no field.
 */
function BoardSearch({ pathname }: { pathname: string }) {
  const board = boardOf(pathname);
  const noun = board ? SEARCHABLE[board] : undefined;
  const [value, setValue] = useState(() =>
    typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("q") ?? ""),
  );

  // A search made on one board must not follow the operator to the next one.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    setValue(new URLSearchParams(window.location.search).get("q") ?? "");
  }, [pathname]);

  if (!noun) return null;

  const commit = (next: string) => {
    const params = new URLSearchParams(window.location.search);
    if (next.trim()) params.set("q", next.trim());
    else params.delete("q");
    const query = params.toString();
    window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <form
      role="search"
      className="flex min-w-0 items-center gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        commit(value);
      }}
    >
      <label htmlFor="band-search" className="sr-only">
        {noun}
      </label>
      <span className="relative flex min-w-0 items-center">
        <Search size={13} aria-hidden="true" className="absolute left-2 text-rail-ink/60" />
        <input
          id="band-search"
          type="search"
          value={value}
          placeholder={noun}
          onChange={(event) => {
            setValue(event.target.value);
            commit(event.target.value);
          }}
          className="min-h-7 w-[9rem] min-w-0 rounded-chip border border-rail-ink/30 bg-rail-ink/10 pr-2 pl-7 text-[0.6875rem] text-rail-ink placeholder:text-rail-ink/55"
        />
      </span>
    </form>
  );
}

function FlatNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { can } = useAccess();
  const items = NAV.flatMap((section) => section.items).filter((item) => can(item.permission));

  return (
    <nav aria-label="Board sections" className="min-w-0">
      <ul className="flex min-w-0 items-center">
        {items.map((item) => {
          const active = isActive(item, pathname);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-7 items-center px-1.5 text-[0.6875rem] font-semibold whitespace-nowrap transition-colors",
                  // The active destination is underlined in the tint, the way a printed column head
                  // is ruled — one mark, and it is the same mark at every width.
                  "border-b-2",
                  active
                    ? "border-selected text-rail-ink"
                    : "border-transparent text-rail-ink/70 hover:border-rail-ink/30 hover:text-rail-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function IdentityLine({ onNavigate }: { onNavigate?: () => void }) {
  const { identity, signOut } = useAuth();
  if (!identity) return null;
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-chip bg-rail-ink font-mono text-[0.625rem] font-semibold text-rail"
      >
        {initials(identity.name)}
      </span>
      <span className="min-w-0">
        <span className="hidden max-w-[10rem] truncate text-[0.6875rem] font-semibold text-rail-ink 2xl:block">
          {identity.name}
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          signOut("user");
        }}
        className="relative text-[0.6875rem] font-semibold text-rail-ink/75 underline decoration-rail-ink/40 hover:text-rail-ink after:absolute after:-inset-3 after:content-['']"
      >
        Sign out
      </button>
    </div>
  );
}

export function TopBand() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  // The menu is closed by the action that causes the navigation (each destination passes `onNavigate`),
  // not by an effect watching the pathname: closing state in an effect is a second render for a change
  // the click already knew about.

  return (
    <header data-rail-surface className="sticky top-0 z-40 bg-rail text-rail-ink">
      <div
        data-top-band
        className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 xl:min-h-12 xl:flex-nowrap xl:py-0"
      >
        <span className="label shrink-0 text-rail-ink/80">admin-panel</span>

        {/* Wide: the flat run. Narrow: the same destinations behind one control.
            The threshold is measured, not chosen by habit: the run plus the search, the scope
            switcher, the board controls, the appearance switcher and the identity needs ~1198px, so
            the band takes the flat form from 1280 and the menu form below it — rather than overflowing
            the page or hiding a destination. */}
        <span className="hidden min-w-0 shrink-0 xl:flex">
          <FlatNav />
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden min-w-0 items-center gap-2 xl:flex">
            <BoardSearch pathname={pathname} />
            <ScopeSwitcher showLabel={false} />
            <BoardControls />
            <AppearanceControl compact placement="below" />
            <IdentityLine />
          </span>
          <span className="flex items-center gap-1 xl:hidden">
            <AppearanceControl compact placement="below" />
            <IconButton
              ref={menuTrigger}
              label="Open navigation"
              onClick={() => setMenuOpen(true)}
              className="text-rail-ink hover:bg-rail-ink/15"
            >
              {menuOpen ? <X size={16} /> : <MenuIcon size={16} />}
            </IconButton>
          </span>
        </span>
      </div>

      {menuOpen ? (
        <div className="border-t border-rail-ink/20 bg-rail px-3 py-3 xl:hidden">
          <nav aria-label="Board sections">
            <ul className="flex flex-col">
              {NAV.map((section) => (
                <li key={section.group} className="py-1">
                  <p className="label mb-1 text-rail-ink/60">{section.group}</p>
                  <ul className="flex flex-col">
                    {section.items.map((item) => (
                      <li key={item.to}>
                        <FlatNavItem item={item} onNavigate={closeMenu} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-rail-ink/20 pt-3">
            <ScopeSwitcher />
            <IdentityLine onNavigate={closeMenu} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** One destination in the narrow overlay: the permission filter lives here so the overlay cannot list
 *  a section the operator cannot open. */
function FlatNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { can } = useAccess();
  if (!can(item.permission)) return null;
  const active = isActive(item, pathname);
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-9 items-center text-body transition-colors",
        active ? "font-semibold text-rail-ink" : "text-rail-ink/75 hover:text-rail-ink",
      )}
    >
      {item.label}
    </Link>
  );
}
