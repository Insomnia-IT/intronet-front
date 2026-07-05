#!/usr/bin/env node
// Download movie poster images referenced in server/vurchel.json.
// Vurchel already serves these as webp, so we just fetch and save them as-is
// under the film_<entryID>.webp naming convention used by web/src/pages/timetable/movie/movie.tsx.
// Dev-only utility. Run from repo root: `node scripts/download-movie-photos.js`.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VURCHEL_JSON = path.join(__dirname, "..", "server", "vurchel.json");
const OUT_DIR = path.join(__dirname, "..", "web", "public", "images", "movies");

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const films = JSON.parse(await fs.readFile(VURCHEL_JSON, "utf8"));
  await fs.mkdir(OUT_DIR, { recursive: true });

  const wanted = new Set();
  let downloaded = 0;
  let cached = 0;
  let failed = 0;
  let skipped = 0;

  for (const film of films) {
    const url = film.images?.[0];
    if (!url) {
      skipped++;
      continue;
    }
    const outFile = path.join(OUT_DIR, `film_${film.entryID}.webp`);
    wanted.add(path.basename(outFile));

    if (await fileExists(outFile)) {
      cached++;
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(outFile, buf);
      downloaded++;
      process.stdout.write(`+ ${film.entryID}\n`);
    } catch (err) {
      failed++;
      process.stdout.write(`- ${film.entryID}: ${err.message}\n`);
    }
  }

  const existing = await fs.readdir(OUT_DIR);
  const stale = existing.filter((f) => f.startsWith("film_") && !wanted.has(f));
  for (const f of stale) {
    await fs.unlink(path.join(OUT_DIR, f));
  }

  console.log(
    `\nDone. downloaded=${downloaded} cached=${cached} failed=${failed} skipped(no image)=${skipped} removedStale=${stale.length}`
  );
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
