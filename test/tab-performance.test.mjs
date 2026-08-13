import assert from 'node:assert/strict';
import test from 'node:test';
import performance from '../tab-performance.js';

test('only marks navigated external tabs as eligible for suspension', () => {
  assert.equal(performance.canSuspendTab({ url: 'https://example.com', suspended: false }), true);
  assert.equal(performance.canSuspendTab({ url: 'file:///app/html/start.html', suspended: false }), false);
  assert.equal(performance.canSuspendTab({ url: 'about:blank', suspended: false }), false);
  assert.equal(performance.canSuspendTab({ url: 'https://example.com', suspended: true }), false);
  assert.equal(performance.canSuspendTab({ url: '', suspended: false }), false);
});

test('summarizes local ledger state without negative cache metrics', () => {
  const ledger = performance.summarizeWorkspaceLedger([
    { id: 1, suspended: false },
    { id: 2, suspended: true },
    { id: 3, suspended: false },
  ], 1048576, true);

  assert.deepEqual(ledger, {
    tabCount: 3,
    liveTabs: 2,
    suspendedTabs: 1,
    cacheBytes: 1048576,
    persistentSession: true,
  });
  assert.equal(performance.summarizeWorkspaceLedger(null, -1, false).cacheBytes, 0);
});
