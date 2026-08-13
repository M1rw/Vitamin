function canSuspendTab(tab) {
  return Boolean(
    tab &&
    !tab.suspended &&
    typeof tab.url === 'string' &&
    tab.url.length > 0 &&
    !tab.url.startsWith('file://') &&
    tab.url !== 'about:blank'
  );
}

function summarizeWorkspaceLedger(tabs, cacheBytes, persistentSession) {
  const workspaceTabs = Array.isArray(tabs) ? tabs : [];
  return {
    tabCount: workspaceTabs.length,
    liveTabs: workspaceTabs.filter((tab) => !tab.suspended).length,
    suspendedTabs: workspaceTabs.filter((tab) => tab.suspended).length,
    cacheBytes: Number.isFinite(cacheBytes) && cacheBytes >= 0 ? cacheBytes : 0,
    persistentSession: Boolean(persistentSession),
  };
}

module.exports = { canSuspendTab, summarizeWorkspaceLedger };
