function parseHttpsUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function shouldAllowPageNavigation(value) {
  return Boolean(parseHttpsUrl(value));
}

function shouldCreateInternalTab(value) {
  return Boolean(parseHttpsUrl(value));
}

module.exports = { parseHttpsUrl, shouldAllowPageNavigation, shouldCreateInternalTab };
