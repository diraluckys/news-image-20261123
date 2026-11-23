// News-image entry: "The World in One Page - 35 Stories" (Monday 23 Nov 2026).
// Node 22, standard library only. The newspaper front page is committed as
// entry.png next to this file; this program copies that exact file to the
// output directory, so the bytes the grader sees are the bytes Win reviewed
// and approved. It does no drawing, no fetching and no random work: read the
// file, check it really is a PNG, write it out, and prove the copy matches
// the original byte for byte before exiting.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function fail(message: string): never {
  throw new Error(message);
}

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
if (!existsSync(source)) fail('entry.png is missing from this repository');

const image = readFileSync(source);
if (image.length < PNG_MAGIC.length || !image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  fail('entry.png is not a valid PNG file');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
writeFileSync(target, image);

const copied = readFileSync(target);
if (sha256(copied) !== sha256(image)) {
  fail('the written entry.png does not match the committed file');
}
