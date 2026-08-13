const GROUP_COLORS = new Set(['orange', 'blueberry', 'acai', 'emerald']);
const MAX_GROUPS_PER_WORKSPACE = 12;
const MAX_GROUP_NAME_LENGTH = 28;

function sanitizeGroupName(value) {
  if (typeof value !== 'string' || /[\u0000-\u001F]/.test(value)) return null;
  const name = value.trim().replace(/\s+/g, ' ');
  return name && name.length <= MAX_GROUP_NAME_LENGTH ? name : null;
}

function sanitizeGroupColor(value) {
  return GROUP_COLORS.has(value) ? value : 'orange';
}

function createGroupId() {
  return `group_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeGroups(value, validWorkspaceIds) {
  const rawGroups = Array.isArray(value) ? value : [];
  const knownWorkspaces = new Set(validWorkspaceIds || []);
  const seenIds = new Set();
  const counts = new Map();
  const groups = [];

  for (const raw of rawGroups) {
    if (typeof raw?.id !== 'string' || !/^group_[a-z0-9_]+$/.test(raw.id) || seenIds.has(raw.id)) continue;
    if (typeof raw.workspaceId !== 'string' || !knownWorkspaces.has(raw.workspaceId)) continue;
    if ((counts.get(raw.workspaceId) || 0) >= MAX_GROUPS_PER_WORKSPACE) continue;
    const name = sanitizeGroupName(raw.name);
    if (!name) continue;
    seenIds.add(raw.id);
    counts.set(raw.workspaceId, (counts.get(raw.workspaceId) || 0) + 1);
    groups.push({
      id: raw.id,
      workspaceId: raw.workspaceId,
      name,
      color: sanitizeGroupColor(raw.color),
      createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    });
  }
  return groups;
}

function createGroupRecord(input, existingGroups, workspaceId) {
  const name = sanitizeGroupName(input?.name);
  if (!name || typeof workspaceId !== 'string') return null;
  const scopedGroups = (existingGroups || []).filter((group) => group.workspaceId === workspaceId);
  if (scopedGroups.length >= MAX_GROUPS_PER_WORKSPACE || scopedGroups.some((group) => group.name.toLowerCase() === name.toLowerCase())) return null;

  return {
    id: createGroupId(),
    workspaceId,
    name,
    color: sanitizeGroupColor(input?.color),
    createdAt: Date.now(),
  };
}

function normalizeTabOrganization(tab, groups) {
  const matchingGroup = (groups || []).find((group) => group.id === tab?.groupId && group.workspaceId === tab?.workspaceId);
  return {
    pinned: Boolean(tab?.pinned),
    groupId: matchingGroup ? matchingGroup.id : null,
  };
}

module.exports = {
  GROUP_COLORS,
  MAX_GROUPS_PER_WORKSPACE,
  createGroupRecord,
  normalizeGroups,
  normalizeTabOrganization,
  sanitizeGroupName,
};
