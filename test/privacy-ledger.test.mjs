import assert from 'node:assert/strict';
import test from 'node:test';
import privacy from '../privacy-ledger.js';

test('normalizes only HTTPS origins and supported permission names', () => {
  assert.equal(privacy.normalizeOrigin('https://example.com/path?q=1'), 'https://example.com');
  assert.equal(privacy.normalizeOrigin('http://example.com'), null);
  assert.equal(privacy.normalizeOrigin('file:///tmp/local.html'), null);
  assert.equal(privacy.normalizePermission('geolocation'), 'geolocation');
  assert.equal(privacy.normalizePermission('unknown-permission'), null);
});

test('keeps privacy rules unique and scoped to known workspaces', () => {
  const rules = privacy.normalizeRules([
    { workspaceId: 'personal', origin: 'https://example.com/a', permission: 'notifications', decision: 'allow', updatedAt: 1 },
    { workspaceId: 'personal', origin: 'https://example.com', permission: 'notifications', decision: 'deny' },
    { workspaceId: 'missing', origin: 'https://other.example', permission: 'media', decision: 'allow' },
  ], ['personal']);

  assert.deepEqual(rules, [{ workspaceId: 'personal', origin: 'https://example.com', permission: 'notifications', decision: 'allow', updatedAt: 1 }]);
  assert.equal(privacy.getRule(rules, 'personal', 'https://example.com', 'notifications').decision, 'allow');
});

test('upserts local rules only for permitted workspaces and decisions', () => {
  const rules = privacy.upsertRule([], { workspaceId: 'personal', origin: 'https://example.com', permission: 'geolocation', decision: 'deny' }, ['personal']);
  assert.equal(rules.length, 1);
  assert.equal(privacy.upsertRule(rules, { workspaceId: 'missing', origin: 'https://example.com', permission: 'geolocation', decision: 'allow' }, ['personal']), null);
  assert.equal(privacy.upsertRule(rules, { workspaceId: 'personal', origin: 'https://example.com', permission: 'geolocation', decision: 'maybe' }, ['personal']), null);
});

test('retains valid local ledger entries and drops unsupported or unscoped ones', () => {
  const ledger = privacy.normalizeLedger([
    { workspaceId: 'personal', origin: 'https://example.com', permission: 'media', decision: 'deny', source: 'request', timestamp: 1 },
    { workspaceId: 'personal', origin: 'https://example.com', permission: 'nope', decision: 'deny', source: 'request' },
    { workspaceId: 'missing', origin: 'https://example.com', permission: 'media', decision: 'allow', source: 'check' },
  ], ['personal']);
  assert.deepEqual(ledger, [{ workspaceId: 'personal', origin: 'https://example.com', permission: 'media', decision: 'deny', source: 'request', timestamp: 1 }]);
});
