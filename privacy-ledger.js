const SUPPORTED_PERMISSIONS = new Set([
  'geolocation',
  'media',
  'notifications',
  'midi',
  'clipboard-read',
  'clipboard-sanitized-write',
  'hid',
  'serial',
  'usb',
  'idle',
]);
const MAX_RULES = 250;
const MAX_LEDGER_ENTRIES = 500;

function normalizeOrigin(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' || !parsed.hostname) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function normalizePermission(value) {
  return typeof value === 'string' && SUPPORTED_PERMISSIONS.has(value) ? value : null;
}

function normalizeDecision(value) {
  return value === 'allow' || value === 'deny' ? value : null;
}

function normalizeRules(value, validWorkspaceIds) {
  const workspaceIds = new Set(validWorkspaceIds || []);
  const seen = new Set();
  const rules = [];
  for (const raw of Array.isArray(value) ? value : []) {
    if (rules.length >= MAX_RULES || !workspaceIds.has(raw?.workspaceId)) continue;
    const origin = normalizeOrigin(raw.origin);
    const permission = normalizePermission(raw.permission);
    const decision = normalizeDecision(raw.decision);
    const key = `${raw.workspaceId}|${origin}|${permission}`;
    if (!origin || !permission || !decision || seen.has(key)) continue;
    seen.add(key);
    rules.push({
      workspaceId: raw.workspaceId,
      origin,
      permission,
      decision,
      updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now(),
    });
  }
  return rules;
}

function normalizeLedger(value, validWorkspaceIds) {
  const workspaceIds = new Set(validWorkspaceIds || []);
  const entries = [];
  for (const raw of Array.isArray(value) ? value : []) {
    if (entries.length >= MAX_LEDGER_ENTRIES || !workspaceIds.has(raw?.workspaceId)) continue;
    const origin = normalizeOrigin(raw.origin);
    const permission = normalizePermission(raw.permission);
    const decision = normalizeDecision(raw.decision);
    if (!origin || !permission || !decision || (raw.source !== 'request' && raw.source !== 'check')) continue;
    entries.push({
      workspaceId: raw.workspaceId,
      origin,
      permission,
      decision,
      source: raw.source,
      timestamp: Number.isFinite(raw.timestamp) ? raw.timestamp : Date.now(),
    });
  }
  return entries.slice(-MAX_LEDGER_ENTRIES);
}

function getRule(rules, workspaceId, origin, permission) {
  return (rules || []).find((rule) => rule.workspaceId === workspaceId && rule.origin === origin && rule.permission === permission) || null;
}

function upsertRule(rules, input, validWorkspaceIds) {
  const workspaceId = input?.workspaceId;
  if (!(validWorkspaceIds || []).includes(workspaceId)) return null;
  const origin = normalizeOrigin(input?.origin);
  const permission = normalizePermission(input?.permission);
  const decision = normalizeDecision(input?.decision);
  if (!origin || !permission || !decision) return null;
  const remaining = (rules || []).filter((rule) => !(rule.workspaceId === workspaceId && rule.origin === origin && rule.permission === permission));
  if (remaining.length >= MAX_RULES) return null;
  return [...remaining, { workspaceId, origin, permission, decision, updatedAt: Date.now() }];
}

module.exports = {
  MAX_LEDGER_ENTRIES,
  SUPPORTED_PERMISSIONS,
  getRule,
  normalizeDecision,
  normalizeLedger,
  normalizeOrigin,
  normalizePermission,
  normalizeRules,
  upsertRule,
};
