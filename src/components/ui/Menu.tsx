/** Menu: a small action list for one row or one corner of the chrome. Keyboard-operable
 *  (Arrow keys, Home/End, Escape), closes on outside click, and returns focus to its trigger. */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./Button";

export interface MenuItem {
  id: string;
  label: string;
  hint?: string;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function Menu({
  label,
  trigger,
  items,
  align = "end",
  triggerClassName,
}: {
  label: string;
  trigger: ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const first = listRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    first?.focus();
  }, [open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const nodes = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [],
    );
    const index = nodes.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      nodes[(index + 1) % nodes.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nodes[(index - 1 + nodes.length) % nodes.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      nodes[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      nodes[nodes.length - 1]?.focus();
    }
  };

  return (
    <div ref={wrap} className="relative">
      <IconButton
        ref={triggerRef}
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
      >
        {trigger}
      </IconButton>
      {open ? (
        <div
          ref={listRef}
          role="menu"
          aria-label={label}
          onKeyDown={onListKeyDown}
          className={cn(
            "absolute z-40 mt-1 min-w-56 border border-rule-strong bg-panel py-1 shadow-overlay",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                close(false);
              }}
              className={cn(
                "flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-body",
                "hover:bg-hover disabled:cursor-not-allowed disabled:opacity-45",
                item.destructive ? "text-attention font-semibold" : "text-ink",
              )}
            >
              <span>{item.label}</span>
              {item.hint ? <span className="ml-auto text-[0.6875rem] text-ink-muted">{item.hint}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
