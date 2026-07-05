#!/usr/bin/env node
// Deduplicate repeated shapes in a Figma-exported map SVG.
//
// Figma emits every tree/bush as its own absolute-coordinate <path>, so the
// same shape stamped in 30 places is 30 full copies. This script normalizes
// each path by subtracting its first point (M x y), groups paths whose relative
// geometry matches, then emits ONE <path> per unique shape into <defs> and
// replaces each occurrence with `<use href="#id" x y/>`. Painting order is
// preserved (each path is swapped in place), so overlaps still render right.
//
// Safe here because the map is injected wholesale and nothing keys off
// individual path ids (see web/src/pages/map/map.tsx). Only absolute
// M/C/L/H/V/Z commands are handled — which is all Figma emits for this map.
//
// Run it BEFORE optimize-map-svg.js:
//   node scripts/dedupe-map-paths.js && node scripts/optimize-map-svg.js
//
// Dev-only utility. Run from repo root. No dependencies.
//
// Usage:
//   node scripts/dedupe-map-paths.js [input.svg] [output.svg]
// Defaults to web/public/images/map2026.svg in place.
//
// Env vars:
//   MATCH_PRECISION=2 - decimals used when comparing shapes for equality
//   MIN_COUNT=2       - only dedupe shapes that appear at least this many times
//   BACKUP=1          - write <name>.orig.svg before overwriting

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_MAP = path.join(REPO_ROOT, "web/public/images/map2026.svg");

const MATCH_PRECISION = Number(process.env.MATCH_PRECISION ?? 2);
const MIN_COUNT = Number(process.env.MIN_COUNT ?? 2);
const BACKUP = process.env.BACKUP === "1";

const input = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MAP;
const output = process.argv[3] ? path.resolve(process.argv[3]) : input;

const fmtKB = (b) => `${(b / 1024).toFixed(1)} KB`;
const round = (v, p) => parseFloat(v.toFixed(p)) || 0; // parseFloat kills "-0"

// Tokenize a path made of absolute M C L H V Z commands into {cmd} | {n}.
function tokenize(d) {
  const re = /([MCLHVZ])|(-?\d*\.?\d+(?:e-?\d+)?)/gi;
  const out = [];
  let m;
  while ((m = re.exec(d))) out.push(m[1] ? { cmd: m[1] } : { n: parseFloat(m[2]) });
  return out;
}

// The first (x, y) pair of the path — the anchor we translate against.
function firstPoint(tokens) {
  const nums = [];
  for (const t of tokens) {
    if (t.n !== undefined) nums.push(t.n);
    if (nums.length === 2) break;
  }
  return nums;
}

// Re-serialize a path with (x0, y0) subtracted from every coordinate, so the
// shape starts at the origin. `prec` controls output precision.
function shiftToOrigin(tokens, x0, y0, prec) {
  let s = "";
  let cmd = null;
  let ai = 0;
  for (const t of tokens) {
    if (t.cmd) {
      cmd = t.cmd;
      ai = 0;
      s += cmd;
      continue;
    }
    let v;
    if (cmd === "H") v = t.n - x0;
    else if (cmd === "V") v = t.n - y0;
    else v = ai % 2 === 0 ? t.n - x0 : t.n - y0;
    s += (ai === 0 && (cmd === "H" || cmd === "V") ? "" : " ") + round(v, prec);
    ai++;
  }
  return s.trim();
}

// Canonical key for grouping: geometry rounded hard so sub-pixel float noise
// between stamped copies collapses to one bucket.
function canonicalShape(tokens, x0, y0) {
  return shiftToOrigin(tokens, x0, y0, MATCH_PRECISION);
}

async function main() {
  const svg = await fs.readFile(input, "utf8");
  const before = Buffer.byteLength(svg);

  // Collect every <path .../> with its byte span and attributes.
  const pathRe = /<path\b([^>]*?)\/?>/g;
  const attrRe = /([\w:-]+)="([^"]*)"/g;
  const paths = [];
  let m;
  while ((m = pathRe.exec(svg))) {
    const attrs = {};
    let a;
    while ((a = attrRe.exec(m[1]))) attrs[a[1]] = a[2];
    if (!attrs.d) continue;
    paths.push({ start: m.index, end: pathRe.lastIndex, attrs });
  }

  // Group by (relative geometry + all non-d attributes). Same key => same
  // definition; instances differ only in translation.
  const groups = new Map();
  for (const p of paths) {
    const tokens = tokenize(p.attrs.d);
    const [x0, y0] = firstPoint(tokens);
    const { d, ...rest } = p.attrs;
    const attrKey = Object.keys(rest)
      .sort()
      .map((k) => `${k}=${rest[k]}`)
      .join("&");
    const key = canonicalShape(tokens, x0, y0) + "|" + attrKey;
    p.tokens = tokens;
    p.x0 = x0;
    p.y0 = y0;
    p.rest = rest;
    p.key = key;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  // Assign symbol ids to groups worth extracting.
  const defs = [];
  let symId = 0;
  for (const [, members] of groups) {
    if (members.length < MIN_COUNT) continue;
    const id = `t${symId++}`;
    const rep = members[0];
    const dOrigin = shiftToOrigin(rep.tokens, rep.x0, rep.y0, 3);
    const attrStr = Object.keys(rep.rest)
      .map((k) => `${k}="${rep.rest[k]}"`)
      .join(" ");
    defs.push(`<path id="${id}" d="${dOrigin}"${attrStr ? " " + attrStr : ""}/>`);
    for (const mem of members) mem.symId = id;
  }

  if (!defs.length) {
    console.log("No repeated shapes met the threshold — nothing to do.");
    return;
  }

  // Rebuild the file, swapping deduped paths for <use> in place.
  let out = "";
  let cursor = 0;
  for (const p of paths) {
    out += svg.slice(cursor, p.start);
    if (p.symId) {
      const x = round(p.x0, MATCH_PRECISION);
      const y = round(p.y0, MATCH_PRECISION);
      out += `<use href="#${p.symId}" x="${x}" y="${y}"/>`;
    } else {
      out += svg.slice(p.start, p.end);
    }
    cursor = p.end;
  }
  out += svg.slice(cursor);

  // Inject the shape definitions right after the opening <svg ...> tag.
  const defsBlock = `<defs>${defs.join("")}</defs>`;
  out = out.replace(/(<svg\b[^>]*>)/, `$1${defsBlock}`);

  if (BACKUP && output === input) {
    const backup = input.replace(/\.svg$/, ".orig.svg");
    await fs.writeFile(backup, svg);
    console.log(`Backup:  ${path.relative(REPO_ROOT, backup)}`);
  }
  await fs.writeFile(output, out);

  const after = Buffer.byteLength(out);
  const dupPaths = paths.filter((p) => p.symId).length;
  const pct = (((before - after) / before) * 100).toFixed(1);
  console.log(`Input:   ${path.relative(REPO_ROOT, input)}  (${fmtKB(before)}, ${paths.length} paths)`);
  console.log(`Shapes:  ${defs.length} reused, replacing ${dupPaths} paths with <use>`);
  console.log(`Output:  ${path.relative(REPO_ROOT, output)}  (${fmtKB(after)})`);
  console.log(`Saved:   ${fmtKB(before - after)} (${pct}%)`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
