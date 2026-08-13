import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('the browser UI inline script parses after command-center additions', () => {
  const html = fs.readFileSync(path.join(root, 'html', 'index.html'), 'utf8');
  const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(matches.length > 0, 'expected an inline browser script');
  const script = matches.at(-1)[1];
  assert.doesNotThrow(() => new Function(script));
});
