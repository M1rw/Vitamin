import assert from 'node:assert/strict';
import test from 'node:test';
import workspaces from '../workspaces.js';

test('normalizes a workspace state with a stable personal default', () => {
  const state = workspaces.normalizeWorkspaceState({
    workspaces: [{ id: 'ws_alpha', name: 'Research', color: 'blueberry', createdAt: 123 }],
    activeWorkspaceId: 'ws_alpha',
  });

  assert.equal(state.workspaces[0].id, 'personal');
  assert.equal(state.workspaces[1].name, 'Research');
  assert.equal(state.activeWorkspaceId, 'ws_alpha');
});

test('rejects malformed, duplicate, and control-character workspace records', () => {
  const state = workspaces.normalizeWorkspaceState({
    workspaces: [
      { id: 'ws_alpha', name: 'Valid', color: 'emerald' },
      { id: 'ws_alpha', name: 'Duplicate', color: 'orange' },
      { id: 'ws_bad', name: 'Invalid\nName', color: 'acai' },
      { id: '../escape', name: 'Unsafe ID', color: 'orange' },
    ],
    activeWorkspaceId: 'not-present',
  });

  assert.deepEqual(state.workspaces.map((workspace) => workspace.id), ['personal', 'ws_alpha']);
  assert.equal(state.activeWorkspaceId, 'personal');
});

test('creates bounded and unique local workspace records', () => {
  const existing = [{ ...workspaces.DEFAULT_WORKSPACE }];
  const record = workspaces.createWorkspaceRecord({ name: '  Project Atlas  ', color: 'acai' }, existing);
  assert.ok(record.id.startsWith('ws_'));
  assert.equal(record.name, 'Project Atlas');
  assert.equal(record.color, 'acai');
  assert.equal(workspaces.createWorkspaceRecord({ name: 'project atlas', color: 'orange' }, [...existing, record]), null);
  assert.equal(workspaces.createWorkspaceRecord({ name: 'bad\u0000name', color: 'orange' }, existing), null);
});

test('uses a dedicated persistent partition for non-personal workspaces', () => {
  assert.equal(workspaces.getWorkspacePartition('personal'), null);
  assert.equal(workspaces.getWorkspacePartition('ws_alpha'), 'persist:vitamin-workspace-ws_alpha');
});
