#!/usr/bin/env node
// Download Google satellite tiles around a center point and stitch them into one image.
// Dev-only utility. Run from repo root: `node scripts/download-map.js`.
// Requires: `yarn add -W -D sharp` (or `npm i -D sharp`).
//
// Env vars:
//   RPM=120   - requests per minute (default 60)
//   ZOOM=18   - tile zoom level (default 18)
//   WIDTH=38  - tiles wide (default 38 -> 9728 px)
//   HEIGHT=24 - tiles tall (default 24 -> 6144 px)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CENTER = { lat: 54.68008397222222, lon: 35.08622484722222 };
const ZOOM = Number(process.env.ZOOM ?? 18);
const WIDTH_TILES = Number(process.env.WIDTH ?? 38);
const HEIGHT_TILES = Number(process.env.HEIGHT ?? 26);
const SHIFT_X = -4;
const SHIFT_Y = -5;
const RPM = Number(process.env.RPM ?? 60);
const DELAY_MS = Math.ceil(60_000 / RPM);
const TILE_SIZE = 256;

const TILE_DIR = path.join(__dirname, "map-tiles");

function lonLatToTile(lon, lat, z) {
  const n = 2 ** z;
  const x = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

const center = lonLatToTile(CENTER.lon, CENTER.lat, ZOOM);
const xStart = Math.floor(center.x - WIDTH_TILES / 2 + SHIFT_X);
const yStart = Math.floor(center.y - HEIGHT_TILES / 2 + SHIFT_Y);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchTile(x, y, z, attempt = 0) {
  const server = ((x + y) % 4 + 4) % 4;
  const url = `https://mt${server}.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Referer: "https://www.google.com/maps/",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt >= 3) throw new Error(`${url} failed: ${err.message}`);
    const backoff = 1000 * 2 ** attempt;
    await sleep(backoff);
    return fetchTile(x, y, z, attempt + 1);
  }
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(TILE_DIR, { recursive: true });

  const total = WIDTH_TILES * HEIGHT_TILES;
  console.log(
    `Center tile: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}) @ z=${ZOOM}`
  );
  console.log(
    `Grid: ${WIDTH_TILES}x${HEIGHT_TILES} = ${total} tiles, ` +
      `${WIDTH_TILES * TILE_SIZE}x${HEIGHT_TILES * TILE_SIZE} px`
  );
  console.log(`Top-left tile: (${xStart}, ${yStart})`);
  console.log(`Rate limit: ${RPM} RPM (${DELAY_MS}ms between requests)\n`);

  let downloaded = 0;
  let cached = 0;
  const t0 = Date.now();

  for (let dy = 0; dy < HEIGHT_TILES; dy++) {
    for (let dx = 0; dx < WIDTH_TILES; dx++) {
      const x = xStart + dx;
      const y = yStart + dy;
      const file = path.join(TILE_DIR, `${ZOOM}_${x}_${y}.jpg`);

      if (await fileExists(file)) {
        cached++;
      } else {
        const buf = await fetchTile(x, y, ZOOM);
        await fs.writeFile(file, buf);
        downloaded++;
        await sleep(DELAY_MS);
      }

      const done = downloaded + cached;
      const pct = ((done / total) * 100).toFixed(1);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      process.stdout.write(
        `\r${done}/${total} (${pct}%)  downloaded=${downloaded} cached=${cached}  ${elapsed}s   `
      );
    }
  }
  process.stdout.write("\n\n");

  console.log("Stitching...");
  const composites = [];
  for (let dy = 0; dy < HEIGHT_TILES; dy++) {
    for (let dx = 0; dx < WIDTH_TILES; dx++) {
      const x = xStart + dx;
      const y = yStart + dy;
      composites.push({
        input: path.join(TILE_DIR, `${ZOOM}_${x}_${y}.jpg`),
        left: dx * TILE_SIZE,
        top: dy * TILE_SIZE,
      });
    }
  }

  const outImage = path.join(__dirname, `map_z${ZOOM}_${xStart}_${yStart}.jpg`);
  // sharp can OOM on very large composites; raise pixel limit and stream.
  await sharp({
    create: {
      width: WIDTH_TILES * TILE_SIZE,
      height: HEIGHT_TILES * TILE_SIZE,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
    limitInputPixels: false,
  })
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outImage);

  console.log(`\nSaved ${outImage}`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});
