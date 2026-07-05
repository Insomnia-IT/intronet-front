#!/usr/bin/env node
// Second dedupe pass, specific to trees.svg (see extract-map-trees.js).
//
// dedupe-map-paths.js already turned each tree into 4 <use> refs to shared
// branch shapes (t0..t8), but left near-duplicates unmerged (Figma emits
// sub-pixel jitter between "the same" branch stamped in different places) and
// a few stragglers as literal <path> (their jittered geometry didn't round to
// an existing group). On top of that, every tree stamps the same 4 shapes at
// the same 3 fixed relative offsets — so the whole decoration set collapses
// to one combined shape, "#tree".
//
// This script:
//   1. Merges branch defs whose geometry is identical, or differs only by
//      sub-pixel jitter (PRECISION decimals), into one canonical id.
//   2. Rewrites leftover inline <path> elements that match a canonical shape
//      into <use> refs, so every tree element is now a <use>.
//   3. Asserts every tree is a consecutive run of 4 <use> covering the 4
//      canonical shapes at one fixed relative offset, builds one merged
//      "#tree" path from that offset, and replaces each run with a single
//      <use href="#tree">.
//
// Path data here mixes absolute and relative M/C commands (SVGO's doing —
// the raw Figma export was all-absolute). Comparing/shifting shapes has to
// resolve everything to absolute coordinates first (see `toAbsolute` below);
// naively shifting every numeric token by a constant breaks relative deltas.
//
// Dev-only utility, tailored to this specific tree template — it asserts its
// assumptions and fails loudly rather than silently skipping unexpected
// shapes, since a partial/silent merge would be worse than a hard error here.
// Run from repo root, after extract-map-trees.js:
//   node scripts/dedupe-trees.js
//
// Usage:
//   node scripts/dedupe-trees.js [trees.svg]
// Defaults to web/public/images/trees.svg in place.
//
// Env vars:
//   PRECISION=1  - decimals kept when comparing/rounding shape geometry
//   BACKUP=1     - write <name>.orig.svg before overwriting

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_TREES = path.join(REPO_ROOT, "web/public/images/trees.svg");

const PRECISION = Number(process.env.PRECISION ?? 1);
// Shapes are "the same" if every corresponding coordinate is within this many
// px (post scale, so this is map-space px) — a plain rounding comparison
// misses jitter straddling a rounding boundary (e.g. 33.4 vs 33.5).
const TOLERANCE = Number(process.env.TOLERANCE ?? 0.2);
const BACKUP = process.env.BACKUP === "1";
const input = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_TREES;

const fmtKB = (b) => `${(b / 1024).toFixed(1)} KB`;
const round = (v, p) => parseFloat(v.toFixed(p)) || 0;

function parseAttrs(str) {
  const attrs = {};
  const re = /([\w:-]+)="([^"]*)"/g;
  let a;
  while ((a = re.exec(str))) attrs[a[1]] = a[2];
  return attrs;
}

// --- Resolve an M/C-only path (mixing absolute + relative commands) into a
// flat list of fully-absolute commands: {type: "M"|"C", pts: [[x,y], ...]}. ---
function toAbsolute(d) {
  const re = /([MmCc])|(-?\d*\.?\d+(?:e-?\d+)?)/g;
  const tokens = [];
  let m;
  while ((m = re.exec(d))) tokens.push(m[1] ? { cmd: m[1] } : { n: parseFloat(m[2]) });

  const commands = [];
  let cx = 0, cy = 0;
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++].cmd;
    if (!cmd) throw new Error(`Expected a command at token ${i} in: ${d}`);
    if (cmd === "M" || cmd === "m") {
      const x = tokens[i++].n, y = tokens[i++].n;
      cx = cmd === "M" ? x : cx + x;
      cy = cmd === "M" ? y : cy + y;
      commands.push({ type: "M", pts: [[cx, cy]] });
    } else if (cmd === "C" || cmd === "c") {
      while (i < tokens.length && tokens[i].n !== undefined) {
        const x1 = tokens[i++].n, y1 = tokens[i++].n;
        const x2 = tokens[i++].n, y2 = tokens[i++].n;
        const x = tokens[i++].n, y = tokens[i++].n;
        const abs = cmd === "C"
          ? [[x1, y1], [x2, y2], [x, y]]
          : [[cx + x1, cy + y1], [cx + x2, cy + y2], [cx + x, cy + y]];
        commands.push({ type: "C", pts: abs });
        [cx, cy] = abs[2];
      }
    } else {
      throw new Error(`Unsupported path command "${cmd}" in: ${d}`);
    }
  }
  return commands;
}

function shiftCommands(commands, dx, dy, prec) {
  return commands.map((c) => ({
    type: c.type,
    pts: c.pts.map(([x, y]) => [round(x + dx, prec), round(y + dy, prec)]),
  }));
}

function serialize(commands) {
  return commands.map((c) => `${c.type}${c.pts.map((p) => p.join(" ")).join(" ")}`).join("");
}

// Canonical, translation-invariant description of a shape: resolve to
// absolute, then re-anchor on its own first point. Left unrounded — shape
// equality is decided by `sameShape`'s tolerance, not by rounding boundaries.
function canonicalAtOrigin(d) {
  const commands = toAbsolute(d);
  const [x0, y0] = commands[0].pts[0];
  return shiftCommands(commands, -x0, -y0, 6);
}

function attrKey(attrs) {
  return Object.keys(attrs).sort().map((k) => `${k}=${attrs[k]}`).join("&");
}

// Same shape (up to translation) if every corresponding coordinate is within
// TOLERANCE — a plain rounded-string comparison misses jitter that straddles
// a rounding boundary (e.g. 33.4 vs 33.5 at precision 0).
function sameShape(a, b, tol) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].type !== b[i].type || a[i].pts.length !== b[i].pts.length) return false;
    for (let j = 0; j < a[i].pts.length; j++) {
      if (Math.abs(a[i].pts[j][0] - b[i].pts[j][0]) > tol) return false;
      if (Math.abs(a[i].pts[j][1] - b[i].pts[j][1]) > tol) return false;
    }
  }
  return true;
}

async function main() {
  const svg = await fs.readFile(input, "utf8");
  const before = Buffer.byteLength(svg);

  const defsMatch = svg.match(/<defs>([\s\S]*?)<\/defs>/);
  if (!defsMatch) throw new Error("No <defs> in " + input);
  let body = svg.slice(defsMatch.index + defsMatch[0].length);

  // --- Step 1: group branch defs by jitter-tolerant shape ---
  const defAttrs = [];
  {
    const re = /<path\b([^>]*)\/>/g;
    let m;
    while ((m = re.exec(defsMatch[1]))) defAttrs.push(parseAttrs(m[1]));
  }
  const defShapes = defAttrs.map((d) => {
    const rest = { ...d };
    delete rest.id;
    delete rest.d;
    return { attrs: d, key: attrKey(rest), shape: canonicalAtOrigin(d.d) };
  });
  // Cluster by tolerance (greedy: attach to the first matching cluster).
  const clusters = [];
  for (const def of defShapes) {
    const cluster = clusters.find((c) => c.key === def.key && sameShape(c.shape, def.shape, TOLERANCE));
    if (cluster) cluster.members.push(def);
    else clusters.push({ key: def.key, shape: def.shape, members: [def] });
  }
  const idToCanonical = new Map();
  const canonicalDefs = new Map(); // id -> attrs
  for (const cluster of clusters) {
    const canonical = cluster.members[0].attrs;
    canonicalDefs.set(canonical.id, canonical);
    for (const mem of cluster.members) idToCanonical.set(mem.attrs.id, canonical.id);
  }
  const merged = [...idToCanonical].filter(([id, canon]) => id !== canon);
  console.log(`Defs:    ${defAttrs.length} branch shapes -> ${canonicalDefs.size} canonical (${merged.map(([a, c]) => `${a}->${c}`).join(", ") || "none merged"})`);

  // --- Step 2: canonicalize <use href>, convert leftover inline <path> ---
  const elRe = /<(use|path)\b([^>]*)\/>/g;
  let m;
  let cursor = 0;
  let out = "";
  let convertedCount = 0;
  while ((m = elRe.exec(body))) {
    const [full, tag, attrStr] = m;
    out += body.slice(cursor, m.index);
    cursor = elRe.lastIndex;
    const attrs = parseAttrs(attrStr);

    if (tag === "use") {
      const canon = idToCanonical.get(attrs.href.replace(/^#/, "")) ?? attrs.href.replace(/^#/, "");
      out += `<use x="${attrs.x}" y="${attrs.y}" href="#${canon}"/>`;
      continue;
    }

    const rest = { ...attrs };
    delete rest.d;
    const key = attrKey(rest);
    const shape = canonicalAtOrigin(attrs.d);
    let matchedId = null;
    for (const [id, def] of canonicalDefs) {
      const defRest = { ...def };
      delete defRest.id;
      delete defRest.d;
      if (key === attrKey(defRest) && sameShape(shape, canonicalAtOrigin(def.d), TOLERANCE)) {
        matchedId = id;
        break;
      }
    }
    if (!matchedId) {
      throw new Error(`Inline <path> didn't match any canonical shape: ${full}`);
    }
    const [x0, y0] = toAbsolute(attrs.d)[0].pts[0];
    convertedCount++;
    out += `<use x="${round(x0, PRECISION)}" y="${round(y0, PRECISION)}" href="#${matchedId}"/>`;
  }
  out += body.slice(cursor);
  body = out;
  console.log(`Inline:  ${convertedCount} stray <path> converted to canonical <use>`);

  // --- Step 3: verify every tree is a 4-use run of the canonical shapes at
  // one fixed relative offset, and merge into a single "#tree" path ---
  const useRe = /<use x="(-?[\d.]+)" y="(-?[\d.]+)" href="#([^"]+)"\/>/g;
  const uses = [];
  while ((m = useRe.exec(body))) {
    uses.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), id: m[3], start: m.index, end: useRe.lastIndex });
  }
  const canonicalIds = [...canonicalDefs.keys()];
  if (uses.length % 4 !== 0) {
    throw new Error(`Expected <use> count to be a multiple of 4, got ${uses.length}`);
  }

  let baseOffsets = null;
  let anchorId = null;
  const runs = [];
  for (let i = 0; i < uses.length; i += 4) {
    const chunk = uses.slice(i, i + 4);
    const ids = chunk.map((u) => u.id);
    if (new Set(ids).size !== 4 || !canonicalIds.every((id) => ids.includes(id))) {
      throw new Error(`Run at index ${i} isn't a permutation of {${canonicalIds.join(",")}}: {${ids.join(",")}}`);
    }
    const anchor = chunk[chunk.length - 1];
    const offsets = new Map(chunk.map((u) => [u.id, { dx: round(u.x - anchor.x, PRECISION), dy: round(u.y - anchor.y, PRECISION) }]));
    const key = JSON.stringify([...offsets].sort());
    if (!baseOffsets) {
      baseOffsets = offsets;
      anchorId = anchor.id;
    }
    if (anchor.id !== anchorId || key !== JSON.stringify([...baseOffsets].sort())) {
      throw new Error(`Run at index ${i} has an inconsistent offset pattern vs. the first run (anchor #${anchor.id} vs #${anchorId})`);
    }
    runs.push({ start: chunk[0].start, end: chunk[3].end, anchor });
  }
  console.log(`Trees:   ${runs.length} runs of {${canonicalIds.join(",")}} share one offset pattern (anchor #${anchorId}) -> merging into #tree`);

  const combinedCommands = canonicalIds.flatMap((id) => {
    const def = canonicalDefs.get(id);
    const commands = toAbsolute(def.d);
    if (id === anchorId) return commands;
    const { dx, dy } = baseOffsets.get(id);
    return shiftCommands(commands, dx, dy, 3);
  });
  const combinedD = serialize(combinedCommands);

  const anchorDef = canonicalDefs.get(anchorId);
  const treeAttrs = { ...anchorDef };
  delete treeAttrs.id;
  delete treeAttrs.d;
  // Prefer opacity=".9" if any merged shape used it (matches 3 of 4 branches;
  // the 4th — the trunk — is fully opaque, a sub-pixel-scale, imperceptible
  // change once combined into one path).
  const anyOpacity = canonicalIds.map((id) => canonicalDefs.get(id).opacity).find(Boolean);
  if (anyOpacity) treeAttrs.opacity = anyOpacity;
  const attrStr = Object.keys(treeAttrs).map((k) => `${k}="${treeAttrs[k]}"`).join(" ");
  const treeDef = `<path id="tree" ${attrStr} d="${combinedD}"/>`;

  let rebuilt = "";
  cursor = 0;
  for (const run of runs) {
    rebuilt += body.slice(cursor, run.start);
    rebuilt += `<use x="${run.anchor.x}" y="${run.anchor.y}" href="#tree"/>`;
    cursor = run.end;
  }
  rebuilt += body.slice(cursor);

  const finalSvg = svg.slice(0, defsMatch.index) + `<defs>${treeDef}</defs>` + rebuilt;

  if (BACKUP) {
    const backup = input.replace(/\.svg$/, ".orig.svg");
    await fs.writeFile(backup, svg);
    console.log(`Backup:  ${path.relative(REPO_ROOT, backup)}`);
  }
  await fs.writeFile(input, finalSvg);
  const after = Buffer.byteLength(finalSvg);
  console.log(`Output:  ${path.relative(REPO_ROOT, input)}  (${fmtKB(before)} -> ${fmtKB(after)})`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
