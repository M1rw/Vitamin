import assert from 'node:assert/strict';
import test from 'node:test';
import reader from '../reader-mode.js';

test('permits reader mode only for bounded HTTPS page URLs', () => {
  assert.equal(reader.isReaderEligible('https://example.com/story'), true);
  assert.equal(reader.isReaderEligible('http://example.com/story'), false);
  assert.equal(reader.isReaderEligible('file:///tmp/page.html'), false);
  assert.equal(reader.isReaderEligible('javascript:alert(1)'), false);
});

test('reader transform uses text-only construction and offers an explicit return path', () => {
  const script = reader.buildReaderModeScript();
  assert.match(script, /article\.textContent = text/);
  assert.match(script, /Reload or toggle Reader/);
  assert.doesNotMatch(script, /innerHTML = text/);
});
