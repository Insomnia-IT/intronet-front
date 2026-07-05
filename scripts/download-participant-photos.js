#!/usr/bin/env node
// Download participant photos referenced in server/data/events.json and convert
// them to webp (matching the existing 150x150 size already used in the repo).
// Dev-only utility. Run from repo root: `node scripts/download-participant-photos.js`.
// Requires: ImageMagick (`magick`) on PATH.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVENTS_JSON = path.join(__dirname, "..", "server", "data", "events.json");
const OUT_DIR = path.join(__dirname, "..", "web", "public", "images", "events");
const PHOTO_SIZE = "i150";

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const events = JSON.parse(await fs.readFile(EVENTS_JSON, "utf8"));
  await fs.mkdir(OUT_DIR, { recursive: true });

  const participants = new Map();
  for (const place of events.places ?? []) {
    for (const activity of place.placeEvents ?? []) {
      for (const p of activity.eventParticipants ?? []) {
        if (p.participantPhoto && !participants.has(p.entry_id)) {
          participants.set(p.entry_id, p.participantPhoto);
        }
      }
    }
  }

  console.log(`Found ${participants.size} unique participants with a photo.`);

  let downloaded = 0;
  let cached = 0;
  let failed = 0;

  for (const [entryId, photo] of participants) {
    const outFile = path.join(OUT_DIR, `participant_${entryId}.webp`);
    if (await fileExists(outFile)) {
      cached++;
      continue;
    }

    const url = photo[PHOTO_SIZE] ?? photo.full;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const tmpFile = `${outFile}.src`;
      await fs.writeFile(tmpFile, buf);
      await execFileAsync("magick", [tmpFile, outFile]);
      await fs.unlink(tmpFile);
      downloaded++;
      process.stdout.write(`+ ${entryId}\n`);
    } catch (err) {
      failed++;
      process.stdout.write(`- ${entryId}: ${err.message}\n`);
    }
  }

  console.log(`\nDone. downloaded=${downloaded} cached=${cached} failed=${failed}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
