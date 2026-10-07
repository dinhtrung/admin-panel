#!/usr/bin/env node
/**
 * Generate the panel's mock organization marks with fal.ai.
 *
 * Run:  node scripts/generate-mock-assets.mjs [--model fal-ai/flux/schnell] [--only aurora-freight]
 *
 * Why this exists as a script rather than a one-off command: the images are *content*, and content
 * that enters the interface has to be reproducible and attributed. This writes the rasters into
 * `public/mock/` and appends the provenance record (model, prompt, date, seed) to
 * `docs/design/mock-assets.md` in the same run, so no raster can ship without its provenance.
 *
 * The key is read from FAL_KEY (environment, or the KEY=value lines of ~/.hermes/.env). It is never
 * written into the repository and never printed.
 *
 * Style constraints this script enforces on every prompt, because a generated mark that ignores the
 * design system is worse than no mark:
 *   - two palette colours only: plum #483048 and pale tint #D5DEF0, on the board ground #F0F0F0
 *   - flat vector geometry: no gradients, no bevels, no drop shadows, no glow (the board is flat)
 *   - no text, letters, numerals or words — generated lettering is illegible and these are marks
 *   - square, centred, generous margin, legible at 24px
 */

import { readFile, writeFile, mkdir, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "mock");
const PROVENANCE = path.join(ROOT, "docs", "design", "mock-assets.md");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const MODEL = flag("--model", "fal-ai/flux/schnell");
const ONLY = flag("--only", null);

/** The eight seeded organizations, each with a motif that is geometric rather than pictorial. */
const ORGANIZATIONS = [
  { slug: "aurora-freight", name: "Aurora Freight", motif: "a rising arc over a horizontal rule" },
  { slug: "kestrel-health", name: "Kestrel Health", motif: "a rounded cross formed from four rectangles" },
  { slug: "meridian-analytics", name: "Meridian Analytics", motif: "a vertical meridian line crossed by three horizontal bars of different length" },
  { slug: "northline-logistics", name: "Northline Logistics", motif: "an upward chevron stacked over a square" },
  { slug: "halcyon-ports", name: "Halcyon Ports", motif: "two nested right angles suggesting a harbour wall" },
  { slug: "brightwater-coop", name: "Brightwater Co-op", motif: "three concentric semicircles opening upward" },
  { slug: "verity-public-works", name: "Verity Public Works", motif: "a grid of nine squares with one square filled" },
  { slug: "lantern-union", name: "Lantern Union", motif: "a hexagon with a small filled square at its centre" },
];

const STYLE =
  "flat vector logo mark, geometric, two colours only (deep plum #483048 and pale lavender #D5DEF0) " +
  "on off-white #F0F0F0 ground, square composition, centred with generous margin, no gradients, " +
  "no shadows, no glow, no bevel, no 3d, no text, no letters, no numerals, no words, " +
  "minimal institutional mark, legible at 24 pixels";

async function readKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY.trim();
  for (const file of [path.join(process.env.HOME ?? "", ".hermes", ".env"), path.join(ROOT, ".env")]) {
    if (!existsSync(file)) continue;
    const line = (await readFile(file, "utf8"))
      .split("\n")
      .find((l) => l.startsWith("FAL_KEY="));
    if (line) return line.slice("FAL_KEY=".length).trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("No FAL_KEY found in the environment or ~/.hermes/.env");
}

async function generate(key, org) {
  const prompt = `${STYLE}. Motif: ${org.motif}.`;
  const response = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, image_size: "square_hd", num_images: 1, output_format: "png" }),
  });
  if (!response.ok) {
    throw new Error(`${org.slug}: fal returned ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
  const payload = await response.json();
  const image = payload.images?.[0];
  if (!image?.url) throw new Error(`${org.slug}: no image in the response`);

  const bytes = Buffer.from(await (await fetch(image.url)).arrayBuffer());
  const file = path.join(OUT_DIR, `${org.slug}.png`);
  await writeFile(file, bytes);
  return { org, prompt, file, seed: payload.seed ?? null, model: MODEL, url: image.url, bytes: bytes.length };
}

const key = await readKey();
await mkdir(OUT_DIR, { recursive: true });

const targets = ORGANIZATIONS.filter((o) => !ONLY || o.slug === ONLY);
if (targets.length === 0) throw new Error(`--only ${ONLY} matched no organization`);

if (!existsSync(PROVENANCE)) {
  await mkdir(path.dirname(PROVENANCE), { recursive: true });
  await appendFile(
    PROVENANCE,
    "# Mock assets\n\nEvery raster in `public/mock/` is synthetic and generated; it is not a real company's\n" +
      "mark and must never be presented as one. Regenerate with `node scripts/generate-mock-assets.mjs`.\n\n" +
      "| File | Organization | Model | Seed | Generated | Prompt |\n|---|---|---|---|---|---|\n",
  );
}

const stamp = new Date().toISOString();
for (const target of targets) {
  const result = await generate(key, target);
  const promptCell = result.prompt.replace(/\|/g, "\\|");
  await appendFile(
    PROVENANCE,
    `| \`public/mock/${target.slug}.png\` | ${target.name} | \`${result.model}\` | ${result.seed ?? "—"} | ${stamp} | ${promptCell} |\n`,
  );
  console.log(`✓ ${target.slug}.png  ${Math.round(result.bytes / 1024)} KB  seed=${result.seed ?? "—"}`);
}
console.log(`\nProvenance appended to ${path.relative(ROOT, PROVENANCE)}`);
