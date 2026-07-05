#!/usr/bin/env node
// Split the tree/bush decorations out of the map SVG into their own file.
//
// map2026.svg mixes static terrain (fills, roads, zones) with ~30 trees, each
// stamped from 9 shared branch shapes (`#t0`..`#t8`, see dedupe-map-paths.js)
// via <use>, plus a handful of one-off inline <path stroke="#55c2b8"> branches
// that didn't match a shared shape. Safari chokes on transforming/scaling the
// whole thing as vector content every frame (see map.tsx's rAF pan/zoom loop),
// but a flat raster background scales as a cheap GPU bitmap instead. So: pull
// the trees out to their own small SVG (kept vector — they're the bit that
// needs to stay crisp while zoomed) and leave map2026.svg as pure background,
// ready for render-map-webp.js to rasterize.
//
// Dev-only utility. Run from repo root, after dedupe-map-paths.js/
// optimize-map-svg.js:
//   node scripts/extract-map-trees.js
//
// Usage:
//   node scripts/extract-map-trees.js [map.svg] [trees.svg]
// Defaults to web/public/images/map2026.svg -> web/public/images/trees.svg,
// rewriting map2026.svg in place with the tree elements removed.
//
// Env vars:
//   BACKUP=1  - write <name>.orig.svg before overwriting map.svg

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_MAP = path.join(REPO_ROOT, "web/public/images/map2026.svg");
const DEFAULT_TREES = path.join(REPO_ROOT, "web/public/images/trees.svg");

const TREE_STROKE = "#55c2b8";
const BACKUP = process.env.BACKUP === "1";

const mapInput = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MAP;
const treesOutput = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_TREES;

const fmtKB = (b) => `${(b / 1024).toFixed(1)} KB`;

function isTreeUse(tag) {
  return /^<use\b/.test(tag) && /href="#t\d+"/.test(tag);
}
function isTreePath(tag) {
  return /^<path\b/.test(tag) && new RegExp(`stroke="${TREE_STROKE}"`).test(tag);
}

async function main() {
  const svg = await fs.readFile(mapInput, "utf8");
  const before = Buffer.byteLength(svg);

  const viewBoxMatch = svg.match(/<svg\b[^>]*\bviewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? "0 0 4096 2803";

  // The first <defs> holds the shared branch shapes (t0..t8) — trees only.
  const defsMatch = svg.match(/<defs>((?:(?!<\/defs>).)*)<\/defs>/s);
  if (!defsMatch) throw new Error("No <defs> block found in " + mapInput);
  const treeDefsBlock = `<defs>${defsMatch[1]}</defs>`;
  let rest = svg.slice(0, defsMatch.index) + svg.slice(defsMatch.index + defsMatch[0].length);

  // Walk top-level self-closing <use>/<path> tags, splitting into tree vs background.
  const tagRe = /<(use|path)\b[^>]*\/>/g;
  let m;
  let cursor = 0;
  let bgOut = "";
  const treeTags = [];
  while ((m = tagRe.exec(rest))) {
    const tag = m[0];
    bgOut += rest.slice(cursor, m.index);
    if (isTreeUse(tag) || isTreePath(tag)) {
      treeTags.push(tag);
    } else {
      bgOut += tag;
    }
    cursor = tagRe.lastIndex;
  }
  bgOut += rest.slice(cursor);

  if (!treeTags.length) {
    console.log("No tree elements found — nothing to extract.");
    return;
  }

  const treesSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="${viewBox}">` +
    treeDefsBlock +
    `<g>${treeTags.join("")}</g>` +
    `</svg>\n`;

  if (BACKUP) {
    const backup = mapInput.replace(/\.svg$/, ".orig.svg");
    await fs.writeFile(backup, svg);
    console.log(`Backup:  ${path.relative(REPO_ROOT, backup)}`);
  }

  await fs.writeFile(mapInput, bgOut);
  await fs.writeFile(treesOutput, treesSvg);

  const after = Buffer.byteLength(bgOut);
  console.log(`Input:   ${path.relative(REPO_ROOT, mapInput)}  (${fmtKB(before)})`);
  console.log(`Trees:   ${treeTags.length} elements -> ${path.relative(REPO_ROOT, treesOutput)}  (${fmtKB(Buffer.byteLength(treesSvg))})`);
  console.log(`Output:  ${path.relative(REPO_ROOT, mapInput)}  (${fmtKB(after)}, background only)`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
