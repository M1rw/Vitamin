import assert from 'node:assert/strict';
import test from 'node:test';
import policy from '../navigation-policy.js';

test('allows only HTTPS page-originated navigation and internal-tab targets', () => {
  assert.equal(policy.parseHttpsUrl('https://example.com/path'), 'https://example.com/path');
  assert.equal(policy.shouldAllowPageNavigation('https://example.com'), true);
  assert.equal(policy.shouldCreateInternalTab('https://example.com'), true);
  assert.equal(policy.shouldAllowPageNavigation('http://example.com'), false);
  assert.equal(policy.shouldCreateInternalTab('file:///tmp/page.html'), false);
  assert.equal(policy.shouldAllowPageNavigation('javascript:alert(1)'), false);
});
