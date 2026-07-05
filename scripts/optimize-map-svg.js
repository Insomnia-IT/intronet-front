#!/usr/bin/env node
// Optimize a Figma-exported map SVG: strip metadata, collapse groups, merge
// paths and — the big win — round the excessive coordinate precision Figma
// emits. At the map's ~4096-wide viewBox, sub-pixel decimals are invisible on
// screen but bloat the file, so we drop them.
//
// The map is fetched and injected wholesale into a <g> (see web/src/pages/map/
// map.tsx), and nothing keys off individual path ids, so aggressive minifying
// is safe. Internal clip/filter id references are preserved by SVGO.
//
// Dev-only utility. Run from repo root: `node scripts/optimize-map-svg.js`.
// Requires: `yarn add -W -D svgo` (or `npm i -D svgo`).
//
// Usage:
//   node scripts/optimize-map-svg.js [input.svg] [output.svg]
// Defaults to optimizing web/public/images/map2026.svg in place.
//
// Env vars:
//   PRECISION=1   - decimal places to keep on coordinates (default 1)
//   BACKUP=1      - write a <name>.orig.svg backup before overwriting

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const DEFAULT_MAP = path.join(
  REPO_ROOT,
  "web/public/images/map2026.svg"
);

const PRECISION = Number(process.env.PRECISION ?? 1);
const BACKUP = process.env.BACKUP === "1";

const inputArg = process.argv[2];
const outputArg = process.argv[3];

const input = inputArg ? path.resolve(inputArg) : DEFAULT_MAP;
const output = outputArg ? path.resolve(outputArg) : input;

const fmtKB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** @type {import("svgo").Config} */
const config = {
  multipass: true,
  js2svg: { indent: 2, pretty: false },
  floatPrecision: PRECISION,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // preset-default keeps the viewBox, which the app's transform math
          // relies on — no override needed.
          // Don't touch ids: internal clip/filter refs must stay resolvable.
          cleanupIds: false,
          // Merging is fine here (no per-path interactivity) and shrinks a lot.
          mergePaths: { force: true },
          convertPathData: { floatPrecision: PRECISION },
          convertTransform: { floatPrecision: PRECISION },
        },
      },
    },
    "removeDimensions", // drop width/height, keep viewBox -> scales to container
    "sortAttrs",
  ],
};

async function main() {
  const svg = await fs.readFile(input, "utf8");
  const before = Buffer.byteLength(svg);

  const { data } = optimize(svg, { path: input, ...config });
  const after = Buffer.byteLength(data);

  if (BACKUP && output === input) {
    const backup = input.replace(/\.svg$/, ".orig.svg");
    await fs.writeFile(backup, svg);
    console.log(`Backup:  ${path.relative(REPO_ROOT, backup)}`);
  }

  await fs.writeFile(output, data);

  const saved = before - after;
  const pct = ((saved / before) * 100).toFixed(1);
  console.log(`Input:   ${path.relative(REPO_ROOT, input)}  (${fmtKB(before)})`);
  console.log(`Output:  ${path.relative(REPO_ROOT, output)}  (${fmtKB(after)})`);
  console.log(`Saved:   ${fmtKB(saved)} (${pct}%)  precision=${PRECISION}`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  if (err.message?.includes("Cannot find package 'svgo'")) {
    console.error("Install it with: yarn add -W -D svgo");
  }
  process.exit(1);
});
