const MAX_CLOSED_TABS = 40;
const MAX_TITLE_LENGTH = 180;
const MAX_URL_LENGTH = 4096;

function isRecoverableUrl(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_URL_LENGTH) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeClosedTabRecord(value, workspaceIds = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (typeof value.id !== 'string' || !/^[a-zA-Z0-9_-]{8,96}$/.test(value.id)) return null;
  if (!workspaceIds.includes(value.workspaceId) || !isRecoverableUrl(value.url)) return null;
  if (!Number.isFinite(value.closedAt) || value.closedAt <= 0) return null;

  return {
    id: value.id,
    workspaceId: value.workspaceId,
    url: value.url,
    title: typeof value.title === 'string' ? value.title.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, MAX_TITLE_LENGTH) : 'Untitled tab',
    favicon: isRecoverableUrl(value.favicon) ? value.favicon : '',
    groupId: typeof value.groupId === 'string' && /^[a-zA-Z0-9_-]{1,96}$/.test(value.groupId) ? value.groupId : null,
    closedAt: Math.floor(value.closedAt),
  };
}

function normalizeClosedTabs(value, workspaceIds = []) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .map((entry) => normalizeClosedTabRecord(entry, workspaceIds))
    .filter((entry) => {
      if (!entry || seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    })
    .sort((a, b) => b.closedAt - a.closedAt)
    .slice(0, MAX_CLOSED_TABS);
}

function createClosedTabRecord(tab, id, closedAt = Date.now()) {
  if (!tab || typeof id !== 'string') return null;
  return normalizeClosedTabRecord({
    id,
    workspaceId: tab.workspaceId,
    url: tab.suspended ? (tab.suspendedUrl || tab.url) : tab.url,
    title: tab.title || 'Untitled tab',
    favicon: tab.favicon || '',
    groupId: tab.groupId || null,
    closedAt,
  }, [tab.workspaceId]);
}

function addClosedTab(entries, entry, workspaceIds = []) {
  const normalizedEntry = normalizeClosedTabRecord(entry, workspaceIds);
  if (!normalizedEntry) return normalizeClosedTabs(entries, workspaceIds);
  return normalizeClosedTabs([normalizedEntry, ...(Array.isArray(entries) ? entries : [])], workspaceIds);
}

function getClosedTabsForWorkspace(entries, workspaceId) {
  return (Array.isArray(entries) ? entries : []).filter((entry) => entry.workspaceId === workspaceId);
}

function takeClosedTab(entries, entryId, workspaceId, workspaceIds = []) {
  const normalizedEntries = normalizeClosedTabs(entries, workspaceIds);
  const index = normalizedEntries.findIndex((entry) => entry.id === entryId && entry.workspaceId === workspaceId);
  if (index === -1) return { entry: null, entries: normalizedEntries };
  const [entry] = normalizedEntries.splice(index, 1);
  return { entry, entries: normalizedEntries };
}

module.exports = {
  MAX_CLOSED_TABS,
  addClosedTab,
  createClosedTabRecord,
  getClosedTabsForWorkspace,
  isRecoverableUrl,
  normalizeClosedTabRecord,
  normalizeClosedTabs,
  takeClosedTab,
};
