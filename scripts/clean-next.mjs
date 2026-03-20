/**
 * Remove .next (fixes ENOENT webpack pack / vendor-chunks errors on Windows).
 */
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const nextDir = join(root, '.next');
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed .next — run npm run dev again.');
} else {
  console.log('No .next folder to remove.');
}
