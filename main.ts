// News-image entry for Monday 23 November 2026. Node 22, standard library
// only. The front page itself is the entry.png committed next to this file;
// this program's only job is to place that exact file at
// /output/entry.png (or $MAKEFUN_OUTPUT_DIR/entry.png outside the grader)
// so the judged bytes are always the reviewed ones.
//
// The grader runs the program twice and requires identical bytes both
// times, so nothing here depends on the clock, the network, or randomness:
// the file is read once, written once, and the written copy is hashed and
// compared against what was read before the program is allowed to finish.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const sourcePath = new URL('./entry.png', import.meta.url);

if (!existsSync(sourcePath)) {
  throw new Error('entry.png is missing from this repository');
}

const image = readFileSync(sourcePath);

// A PNG always starts with the same eight signature bytes; refuse a
// committed file that is not a PNG at all instead of handing the grader
// something it would reject.
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (image.length < pngSignature.length || !image.subarray(0, 8).equals(pngSignature)) {
  throw new Error('entry.png is not a valid PNG file');
}

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const targetPath = join(outDir, 'entry.png');
writeFileSync(targetPath, image);

// The graded image must be byte-for-byte the committed file, so hash the
// copy that was just written and refuse to finish if it differs at all.
const writtenHash = createHash('sha256').update(readFileSync(targetPath)).digest('hex');
const sourceHash = createHash('sha256').update(image).digest('hex');
if (writtenHash !== sourceHash) {
  throw new Error('written entry.png does not match the committed file');
}
