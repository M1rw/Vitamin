import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import guards from '../ipc-guards.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlRoot = path.join(repositoryRoot, 'html');
const internalEvent = (fileName) => ({
  senderFrame: { url: pathToFileURL(path.join(htmlRoot, fileName)).toString() },
});

test('accepts only bundled internal HTML senders', () => {
  assert.equal(guards.getTrustedInternalFile(internalEvent('index.html')), 'index.html');
  assert.equal(guards.getTrustedInternalFile({ senderFrame: { url: 'https://untrusted.example/' } }), null);
  assert.equal(guards.getTrustedInternalFile({ senderFrame: { url: 'file:///tmp/untrusted.html' } }), null);
  assert.equal(guards.requireTrustedInternalSender(internalEvent('start.html'), 'search-request', ['start.html']), true);
  assert.equal(guards.requireTrustedInternalSender(internalEvent('blocked.html'), 'search-request', ['start.html']), false);
});

test('normalises only safe browser navigation inputs', () => {
  assert.equal(guards.normaliseNavigationInput('example.com'), 'https://example.com/');
  assert.equal(guards.normaliseNavigationInput('https://example.com/docs'), 'https://example.com/docs');
  assert.equal(guards.normaliseNavigationInput('privacy browser'), 'https://duckduckgo.com/?q=privacy%20browser');
  assert.equal(guards.normaliseNavigationInput('javascript:alert(1)'), null);
  assert.equal(guards.normaliseNavigationInput('file:///etc/passwd'), null);
  assert.equal(guards.normaliseNavigationInput('data:text/html,hello'), null);
  assert.equal(guards.normaliseNavigationInput(`https://example.com/${'a'.repeat(4096)}`), null);
});

test('validates direct HTTP(S) URLs and bounded search queries', () => {
  assert.equal(guards.parseHttpUrl('https://example.com').hostname, 'example.com');
  assert.equal(guards.parseHttpUrl('mailto:test@example.com'), null);
  assert.equal(guards.parseHttpUrl('javascript:alert(1)'), null);
  assert.equal(guards.normaliseSearchQuery('  private search  '), 'private search');
  assert.equal(guards.normaliseSearchQuery(''), null);
  assert.equal(guards.normaliseSearchQuery(`x${'x'.repeat(512)}`), null);
  assert.equal(guards.normaliseSearchQuery('line\nbreak'), null);
});

test('limits filesystem actions to recorded downloads', () => {
  const downloads = [{ savePath: '/home/ubuntu/Downloads/vitamin.deb' }];
  assert.equal(guards.isKnownDownloadPath('/home/ubuntu/Downloads/vitamin.deb', downloads), true);
  assert.equal(guards.isKnownDownloadPath('/home/ubuntu/Downloads/../Downloads/vitamin.deb', downloads), true);
  assert.equal(guards.isKnownDownloadPath('/etc/passwd', downloads), false);
  assert.equal(guards.isKnownDownloadPath('', downloads), false);
});

test('rejects empty and oversized bookmarklet payloads', () => {
  assert.equal(guards.isSafeBookmarklet('document.body.dataset.vitamin = "ok";'), true);
  assert.equal(guards.isSafeBookmarklet(''), false);
  assert.equal(guards.isSafeBookmarklet('x'.repeat(20001)), false);
});
