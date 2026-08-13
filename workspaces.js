const DEFAULT_WORKSPACE = Object.freeze({
  id: 'personal',
  name: 'Personal',
  color: 'orange',
  createdAt: 0,
});

const ALLOWED_COLORS = new Set(['orange', 'blueberry', 'acai', 'emerald']);
const MAX_WORKSPACES = 8;
const MAX_NAME_LENGTH = 32;

function sanitizeWorkspaceName(value) {
  if (typeof value !== 'string') return null;
  if (/[\u0000-\u001F]/.test(value)) return null;
  const name = value.trim().replace(/\s+/g, ' ');
  if (!name || name.length > MAX_NAME_LENGTH) return null;
  return name;
}

function sanitizeWorkspaceColor(value) {
  return ALLOWED_COLORS.has(value) ? value : DEFAULT_WORKSPACE.color;
}

function createWorkspaceId() {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeWorkspaceState(value) {
  const rawWorkspaces = Array.isArray(value?.workspaces) ? value.workspaces : [];
  const seenIds = new Set();
  const workspaces = [];

  for (const raw of rawWorkspaces) {
    if (workspaces.length >= MAX_WORKSPACES || typeof raw?.id !== 'string' || !/^ws_[a-z0-9_]+$|^personal$/.test(raw.id) || seenIds.has(raw.id)) continue;
    const name = sanitizeWorkspaceName(raw.name);
    if (!name) continue;
    seenIds.add(raw.id);
    workspaces.push({
      id: raw.id,
      name,
      color: sanitizeWorkspaceColor(raw.color),
      createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    });
  }

  if (!seenIds.has(DEFAULT_WORKSPACE.id)) {
    workspaces.unshift({ ...DEFAULT_WORKSPACE });
  }

  const activeWorkspaceId = workspaces.some((workspace) => workspace.id === value?.activeWorkspaceId)
    ? value.activeWorkspaceId
    : DEFAULT_WORKSPACE.id;

  return { workspaces, activeWorkspaceId };
}

function createWorkspaceRecord(input, existingWorkspaces) {
  if (!Array.isArray(existingWorkspaces) || existingWorkspaces.length >= MAX_WORKSPACES) return null;
  const name = sanitizeWorkspaceName(input?.name);
  if (!name || existingWorkspaces.some((workspace) => workspace.name.toLowerCase() === name.toLowerCase())) return null;

  return {
    id: createWorkspaceId(),
    name,
    color: sanitizeWorkspaceColor(input?.color),
    createdAt: Date.now(),
  };
}

function getWorkspacePartition(workspaceId) {
  return workspaceId === DEFAULT_WORKSPACE.id ? null : `persist:vitamin-workspace-${workspaceId}`;
}

module.exports = {
  ALLOWED_COLORS,
  DEFAULT_WORKSPACE,
  MAX_WORKSPACES,
  createWorkspaceRecord,
  getWorkspacePartition,
  normalizeWorkspaceState,
  sanitizeWorkspaceName,
};
