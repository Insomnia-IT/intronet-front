#!/usr/bin/env node
// Rasterize the (tree-free) background map SVG to WebP.
//
// Panning/zooming map2026.svg as live vector content is what makes Safari
// mobile choke (see map.tsx's rAF transform loop) — a flat raster bitmap
// scales as cheap GPU compositing instead. Run extract-map-trees.js first so
// the trees (which need to stay crisp while zoomed) aren't baked into this.
//
// Dev-only utility. Run from repo root.
// Requires: `yarn add -W -D sharp` (or `npm i -D sharp`).
//
// Usage:
//   node scripts/render-map-webp.js [input.svg] [output.webp]
// Defaults to web/public/images/map2026.svg -> web/public/images/map2026.webp
//
// Env vars:
//   WIDTH=1024   - output width in px (height follows the source aspect ratio)
//   QUALITY=82   - WebP quality

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_INPUT = path.join(REPO_ROOT, "web/public/images/map2026.svg");
const DEFAULT_OUTPUT = path.join(REPO_ROOT, "web/public/images/map2026.webp");

const WIDTH = Number(process.env.WIDTH ?? 1024);
const QUALITY = Number(process.env.QUALITY ?? 82);

const input = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_INPUT;
const output = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_OUTPUT;

const fmtKB = (b) => `${(b / 1024).toFixed(1)} KB`;

async function main() {
  const svg = await fs.readFile(input);
  const image = sharp(svg, { limitInputPixels: false }).resize({ width: WIDTH });
  await image.webp({ quality: QUALITY }).toFile(output);

  const meta = await sharp(output).metadata();
  const stat = await fs.stat(output);
  console.log(`Input:   ${path.relative(REPO_ROOT, input)}`);
  console.log(`Output:  ${path.relative(REPO_ROOT, output)}  (${meta.width}x${meta.height}, ${fmtKB(stat.size)}, q=${QUALITY})`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  if (err.message?.includes("Cannot find module 'sharp'") || err.code === "MODULE_NOT_FOUND") {
    console.error("Install it with: yarn add -W -D sharp");
  }
  process.exit(1);
});
