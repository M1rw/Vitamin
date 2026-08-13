import assert from 'node:assert/strict';
import test from 'node:test';
import recovery from '../tab-recovery.js';

const {
  MAX_CLOSED_TABS,
  addClosedTab,
  createClosedTabRecord,
  getClosedTabsForWorkspace,
  normalizeClosedTabs,
  takeClosedTab,
} = recovery;

const workspaceIds = ['personal', 'research'];

function entry(id, workspaceId = 'personal', closedAt = 1) {
  return {
    id,
    workspaceId,
    url: `https://example.com/${id}`,
    title: `Tab ${id}`,
    favicon: 'https://example.com/favicon.ico',
    groupId: null,
    closedAt,
  };
}

test('normalizes valid local recovery records and rejects unsafe or malformed data', () => {
  const result = normalizeClosedTabs([
    entry('valid_entry', 'personal', 20),
    entry('valid_entry', 'personal', 19),
    { ...entry('unsafe', 'personal', 18), url: 'file:///tmp/local.html' },
    { ...entry('unknown_workspace', 'private', 17) },
    { ...entry('invalid_id!', 'personal', 16) },
  ], workspaceIds);

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'valid_entry');
  assert.equal(result[0].closedAt, 20);
});

test('creates recovery records from navigated tabs but excludes blank or internal pages', () => {
  const recovered = createClosedTabRecord({
    workspaceId: 'personal',
    url: 'https://vitamin.example/article',
    title: 'A readable article',
    favicon: 'https://vitamin.example/icon.png',
    groupId: 'reading',
  }, 'closed_valid');

  const blank = createClosedTabRecord({ workspaceId: 'personal', url: '', title: 'New Tab' }, 'closed_blank');
  const internal = createClosedTabRecord({ workspaceId: 'personal', url: 'file:///bundle/start.html', title: 'Start' }, 'closed_internal');

  assert.equal(recovered.workspaceId, 'personal');
  assert.equal(recovered.groupId, 'reading');
  assert.equal(blank, null);
  assert.equal(internal, null);
});

test('keeps recovery history bounded, newest-first, and workspace scoped', () => {
  let entries = [];
  for (let index = 0; index < MAX_CLOSED_TABS + 4; index += 1) {
    entries = addClosedTab(entries, entry(`closed_${index}`, index % 2 ? 'personal' : 'research', index + 1), workspaceIds);
  }

  assert.equal(entries.length, MAX_CLOSED_TABS);
  assert.ok(entries[0].closedAt > entries.at(-1).closedAt);
  assert.ok(getClosedTabsForWorkspace(entries, 'personal').every((item) => item.workspaceId === 'personal'));
  assert.ok(getClosedTabsForWorkspace(entries, 'research').every((item) => item.workspaceId === 'research'));
});

test('removes only the selected recovery entry from its original workspace', () => {
  const entries = normalizeClosedTabs([
    entry('closed_personal', 'personal', 2),
    entry('closed_research', 'research', 1),
  ], workspaceIds);

  const wrongWorkspace = takeClosedTab(entries, 'closed_personal', 'research', workspaceIds);
  assert.equal(wrongWorkspace.entry, null);
  assert.equal(wrongWorkspace.entries.length, 2);

  const recovered = takeClosedTab(entries, 'closed_personal', 'personal', workspaceIds);
  assert.equal(recovered.entry.url, 'https://example.com/closed_personal');
  assert.equal(recovered.entries.length, 1);
  assert.equal(recovered.entries[0].workspaceId, 'research');
});
