/** Appearance: system, light or dark — one resolution path, applied before paint by the inline
 *  script in index.html and kept in sync here. */

export type Appearance = "system" | "light" | "dark";

export const APPEARANCE_KEY = "admin-panel.appearance";

export function readAppearance(): Appearance {
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY);
    return raw === "light" || raw === "dark" ? raw : "system";
  } catch {
    return "system";
  }
}

export function resolvedAppearance(choice: Appearance): "light" | "dark" {
  if (choice === "light" || choice === "dark") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyAppearance(choice: Appearance): void {
  document.documentElement.setAttribute("data-theme", resolvedAppearance(choice));
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", choice === "system" ? "light dark" : choice);
}

export function writeAppearance(choice: Appearance): void {
  try {
    localStorage.setItem(APPEARANCE_KEY, choice);
  } catch {
    // storage unavailable: the choice still applies for this session
  }
  applyAppearance(choice);
}

/** When the operator has chosen "system", follow the OS as it changes during the session. */
export function watchSystemAppearance(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    if (readAppearance() === "system") {
      applyAppearance("system");
      onChange();
    }
  };
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
