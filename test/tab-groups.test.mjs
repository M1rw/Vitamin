import assert from 'node:assert/strict';
import test from 'node:test';
import groups from '../tab-groups.js';

test('normalizes only unique groups that belong to known workspaces', () => {
  const normalized = groups.normalizeGroups([
    { id: 'group_alpha', workspaceId: 'personal', name: 'Research', color: 'blueberry', createdAt: 1 },
    { id: 'group_alpha', workspaceId: 'personal', name: 'Duplicate', color: 'orange' },
    { id: 'group_unknown', workspaceId: 'missing', name: 'Other', color: 'acai' },
    { id: 'group_bad', workspaceId: 'personal', name: 'Bad\nName', color: 'emerald' },
  ], ['personal']);

  assert.deepEqual(normalized, [{ id: 'group_alpha', workspaceId: 'personal', name: 'Research', color: 'blueberry', createdAt: 1 }]);
});

test('creates bounded, unique group records within one workspace', () => {
  const existing = [{ id: 'group_alpha', workspaceId: 'personal', name: 'Research', color: 'orange', createdAt: 1 }];
  const created = groups.createGroupRecord({ name: '  Planning  ', color: 'emerald' }, existing, 'personal');
  assert.ok(created.id.startsWith('group_'));
  assert.equal(created.name, 'Planning');
  assert.equal(created.color, 'emerald');
  assert.equal(groups.createGroupRecord({ name: 'research', color: 'orange' }, existing, 'personal'), null);
  assert.equal(groups.createGroupRecord({ name: 'bad\u0000name', color: 'orange' }, existing, 'personal'), null);
});

test('retains group assignment only when it belongs to the tab workspace', () => {
  const available = [{ id: 'group_alpha', workspaceId: 'personal', name: 'Research', color: 'orange' }];
  assert.deepEqual(groups.normalizeTabOrganization({ workspaceId: 'personal', groupId: 'group_alpha', pinned: true }, available), { pinned: true, groupId: 'group_alpha' });
  assert.deepEqual(groups.normalizeTabOrganization({ workspaceId: 'other', groupId: 'group_alpha', pinned: false }, available), { pinned: false, groupId: null });
});
